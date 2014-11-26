var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var not = require('app/utils').not;
var Request = require('./request');
var Response = require('./response');

var methods = require('./methods').methods.map(function (m) {
  return m.split('.');
});


function UnathorizedApiState(attrs) {
  this.version = attrs.version;
  this.entryPoint = attrs.entryPoint;
  this.pending = attrs.pending;
  this.isAuthorized = false;
}

UnathorizedApiState.prototype.authorize = function (user, token) {
  return new ProcessingApiState({
    user: user,
    token: token,
    entryPoint: this.entryPoint,
    pending: this.pending,
    version: this.version
  });
};

UnathorizedApiState.prototype.takeResult = function (req, res) {
  return this;
};

UnathorizedApiState.prototype.modify = function (attrs) {
  return new UnathorizedApiState(_.extend({}, this, attrs));
};

function ProcessingApiState(attrs) {
  this.token = attrs.token;
  this.user = attrs.user;
  this.version = attrs.version;
  this.entryPoint = attrs.entryPoint;
  this.pending = attrs.pending;
  this.isAuthorized = true;
}

ProcessingApiState.prototype.authorize = function(user, token) {
  return this;
};

ProcessingApiState.prototype.takeResult = function(req, res) {
  if (res.tooManyRequests()) {
    return new ProcessingApiState({
      token: this.token,
      user: this.user,
      entryPoint: this.entryPoint,
      version: this.version,
      pending: this.pending.concat(req.nextAttempt())
    });
  }

  if (res.captchaNeeded()) {
    return new LimitedAccessApiState({
      token: this.token,
      user: this.user,
      entryPoint: this.entryPoint,
      version: this.version,
      pending: this.pending.concat(req.nextAttempt())
    });
  }

  return this;
};

ProcessingApiState.prototype.modify = function (attrs) {
  return new ProcessingApiState(_.extend({}, this, attrs));
};




function LimitedAccessApiState(attrs) {
  this.token = attrs.token;
  this.user = attrs.user;
  this.version = attrs.version;
  this.entryPoint = attrs.entryPoint;
  this.pending = attrs.pending;
  this.isAuthorized = true;
}

LimitedAccessApiState.prototype.authorize = function(user, token) {
  return this;
};

LimitedAccessApiState.prototype.takeResult = function (req, res) {
  return this;
};

LimitedAccessApiState.prototype.modify = function (attrs) {
  return new LimitedAccessApiState(_.extend({}, this, attrs));
};



function VkApi(attrs) {
  this.state = attrs.state;
  this.interval = 1000 / attrs.rateLimit;

  this.nextTick();
  setupHelpers(this);
}

VkApi.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: VkApi, enumerable: false }
});

VkApi.prototype.nextTick = function() {
  this.timer = setTimeout(this.process.bind(this), this.interval);
};

VkApi.prototype.authorize = function(user, token) {
  this.state = this.state.authorize(user, token);
  this.emit('change');
};

VkApi.prototype.request = function (method, options, done) {
  var req = new Request({
    entryPoint: this.state.entryPoint,
    token: this.state.token,
    version: this.state.version,
    method: method,
    params: options,
    attempt: 0,
    callback: done
  });

  this.state = this.state.modify({
    pending: this.state.pending.concat(req)
  });

  this.emit('change');
  this.resume();
};

VkApi.prototype.process = function() {
  if (this.state.pending.length === 0) {
    return this.idle();
  }

  var req = this.state.pending[0];

  req.send(function(err, data) {
    var res = new Response(err, data);
    this.state = this.state.takeResult(req, res);
    res.send(req.callback);
    this.emit('change');
  }.bind(this));

  this.emit('process');

  this.state = this.state.modify({
    pending: this.state.pending.slice(1)
  });

  this.emit('change');
  this.nextTick();
};

VkApi.prototype.idle = function() {
  this.emit('idle');
  clearTimeout(this.timer);
};

VkApi.prototype.resume = function() {
  clearTimeout(this.timer);
  this.emit('resume');
  this.nextTick();
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

module.exports = new VkApi({
  rateLimit: 2,
  state: new UnathorizedApiState({
    version: '5.25',
    entryPoint: 'https://api.vk.com/method/',
    pending: []
  })
});
