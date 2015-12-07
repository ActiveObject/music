var _ = require('underscore');
var merge = require('app/merge');
var Request = require('./request');
var Response = require('./response');
var Atom = require('app/Atom');

var methods = require('./methods').methods.map(function (m) {
  return m.split('.');
});

function not(predicate, ctx) {
  return function not() {
    return !predicate.apply(ctx, arguments);
  };
}

function UnathorizedApiState(attrs) {
  this.pending = attrs.pending;
  this.isAuthorized = false;
}

UnathorizedApiState.prototype.authorize = function (user) {
  return new ProcessingApiState({
    user: user.id,
    token: user.accessToken,
    pending: this.pending.map(req => req.modify({ token: user.accessToken }))
  });
};

UnathorizedApiState.prototype.takeResult = function (req, res) {
  return this;
};

UnathorizedApiState.prototype.modify = function (attrs) {
  return new UnathorizedApiState(merge(this, attrs));
};

function ProcessingApiState(attrs) {
  this.token = attrs.token;
  this.user = attrs.user;
  this.pending = attrs.pending;
  this.isAuthorized = true;
}

ProcessingApiState.prototype.authorize = function (user) {
  return this;
};

ProcessingApiState.prototype.takeResult = function(req, res) {
  if (res.tooManyRequests()) {
    return new ProcessingApiState({
      token: this.token,
      user: this.user,
      pending: this.pending.concat(req.nextAttempt())
    });
  }

  if (res.captchaNeeded()) {
    return new LimitedAccessApiState({
      token: this.token,
      user: this.user,
      pending: this.pending.concat(req.nextAttempt())
    });
  }

  return this;
};

ProcessingApiState.prototype.modify = function (attrs) {
  return new ProcessingApiState(merge(this, attrs));
};

function LimitedAccessApiState(attrs) {
  this.token = attrs.token;
  this.user = attrs.user;
  this.pending = attrs.pending;
  this.isAuthorized = true;
}

LimitedAccessApiState.prototype.authorize = function (user) {
  return this;
};

LimitedAccessApiState.prototype.takeResult = function (req, res) {
  return this;
};

LimitedAccessApiState.prototype.modify = function (attrs) {
  return new LimitedAccessApiState(merge(this, attrs));
};



function VkApi(attrs) {
  this.interval = 1000 / attrs.rateLimit;
  this.atom = attrs.atom;
  this.version = attrs.version;
  this.entryPoint = attrs.entryPoint;
  this.queue = [];
  this.start();
  setupHelpers(this);
}

VkApi.prototype.start = function() {
  var nextTick = () => {
    this.timer = setTimeout(() => {
      this.process();
      nextTick();
    }, this.interval);
  }

  nextTick();
};

VkApi.prototype.stop = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
};

VkApi.prototype.authorize = function(user) {
  Atom.update(this, state => state.authorize(user));
};

VkApi.prototype.request = function (method, options, done) {
  var req = new Request({
    entryPoint: this.entryPoint,
    version: this.version,
    token: this.atom.value.token,
    method: method,
    params: options,
    attempt: 0,
    callback: done
  });

  this.queue.push(req);
};

VkApi.prototype.process = function() {
  if (this.queue.length === 0) {
    return;
  }

  var req = this.queue.shift();

  req.send(function(err, data) {
    var res = new Response(err, data);
    res.send(req.callback);
    Atom.update(this, state => state.takeResult(req, res));
  }.bind(this));
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
  version: '5.29',
  entryPoint: 'https://api.vk.com/method/',
  atom: new Atom(new UnathorizedApiState({
    pending: []
  }))
});
