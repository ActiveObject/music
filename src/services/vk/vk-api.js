var _ = require('underscore');
var not = require('app/utils').not;

var methods = require('./methods').methods.map(function (m) {
  return m.split('.');
});

var Request = require('./request');

function VkApi(options) {
  if (options.auth.type !== 'oauth') {
    throw new Error('VkApi support only oauth authorization');
  }

  this.token = options.auth.token;
  this.user  = options.auth.user;
  this.entryPoint = 'https://api.vk.com/method/';
  this.rateLimit = options.rateLimit || 3;
  this.requestLimit = options.requestLimit || 3;

  this._lastRequestTime = 0;
  this._queue = [];

  setupHelpers(this);
}

VkApi.TOO_MANY_REQUESTS = 6;
VkApi.CAPTCHA_NEEDED = 14;

VkApi.prototype.request = function (method, options, done) {
  var url = this.entryPoint + method;
  var params = _.extend(options, {
    access_token: this.token
  });
  this.enqueue(new Request(url, this.nextRequestTime(), params, done)).process();
};

VkApi.prototype.lastRequestTime = function () {
  return this._lastRequestTime;
};

VkApi.prototype.nextRequestTime = function () {
  var reqInterval = Math.floor(1000 / this.rateLimit);
  var now = Date.now();

  if (now - this.lastRequestTime() < 0) {
    return this.lastRequestTime() + reqInterval;
  }

  if (now - this.lastRequestTime() < reqInterval) {
    return now + reqInterval;
  }

  return now;
};

VkApi.prototype.enqueue = function (req) {
  req.attempt += 1;
  this._queue.push(req);
  return this;
};

VkApi.prototype.unshift = function (req) {
  req.attempt += 1;
  this._queue.unshift(req);
  return this;
};

VkApi.prototype.dequeue = function () {
  var req = this._queue.shift();
  this._lastRequestTime = req.time;
  return req;
};

VkApi.prototype.pause = function () {
  this._paused = true;
  return this;
};

VkApi.prototype.resume = function () {
  this._paused = false;
  return this;
};

VkApi.prototype.isPaused = function () {
  return this._paused;
};

VkApi.prototype.resetTime = function () {
  var now = Date.now();
  var reqInterval = Math.floor(1000 / this.rateLimit);
  this._queue.forEach(function (req, i) {
    req.time = now + reqInterval * i;
  });
  return this;
};

VkApi.prototype.process = function () {
  if (this.isPaused()) {
    return;
  }

  var req = this.dequeue();
  var api = this;
  var onResponse = function (err, data) {
    if (api.isPaused()) {
      return api.enqueue(req);
    }

    if (err) {
      // too many request - repeat request
      if (err.error_code === VkApi.TOO_MANY_REQUESTS) {
        console.warn('[vk.api] %s, rateLimit = %d', err.error_msg, api.rateLimit);
        return api.enqueue(req).process();
      }

      if (err.error_code === VkApi.CAPTCHA_NEEDED) {
        console.warn('[vk.api] %s', err.error_msg);
        api.pause();
        return api.onCaptcha(err.captcha_img, function (text) {
          var params = _.extend(req.params, {
            captcha_sid: err.captcha_sid,
            captcha_key: text
          });

          api.unshift(new Request(req.url, api.nextRequestTime(), params, req.callback))
              .resetTime()
              .resume()
              .process();
        });
      }

      return req.callback(err);
    }

    req.callback(null, data);
  };

  var now = Date.now();
  var delay = req.time < now ? 0 : req.time - now;
  console.log('delay request %d ms', delay);

  setTimeout(function () {
    req.send(onResponse);
  }, delay);

  if (this._queue.length > 0) {
    this.process();
  }
};

function setupHelpers(apiObj) {
  var makeRequest = function (api, method, group) {
    var mname = group ? [group, method].join('.') : method;
    api[method] = function (options, callback) {
      return apiObj.request(mname, options, callback);
    };
    return api;
  };

  // setup global api methods
  var globalMethods = methods.filter(isGlobal);
  globalMethods.map(_.head).reduce(function (api, method) {
    return makeRequest(api, method);
  }, apiObj);

  // setup api methods by group
  var groupedMethods = methods.filter(not(isGlobal));
  var group  = function (item) { return item[0]; };
  var method = function (item) { return item[1]; };

  var byGroup = _(groupedMethods).groupBy(group);

  Object.keys(byGroup).reduce(function (api, gname) {
    api[gname] = byGroup[gname].reduce(function (api, item) {
      return makeRequest(api, method(item), group(item));
    }, {});
    return api;
  }, apiObj);
}

function isGlobal(method) {
  return method.length === 1;
}

module.exports = VkApi;