import Atom from 'app/Atom';
import merge from 'app/merge';
import Request from './request';
import Response from './response';
import setupHelpers from './setupHelpers';

function UnathorizedApiState() {
  this.isAuthorized = false;
}

UnathorizedApiState.prototype.authorize = function (user) {
  return new ProcessingApiState({
    user: user.id,
    token: user.accessToken
  });
};

UnathorizedApiState.prototype.process = function (queue) {
  return queue;
};

function ProcessingApiState(attrs) {
  this.token = attrs.token;
  this.user = attrs.user;
  this.isAuthorized = true;
}

ProcessingApiState.prototype.authorize = function (user) {
  return this;
};

ProcessingApiState.prototype.process = function (reqParams, callback) {
  var req = new Request(merge(reqParams, {
    token: this.token
  }));

  req.send((err, data) => callback(err, data, req));
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
  this.queue.push({
    entryPoint: this.entryPoint,
    version: this.version,
    method: method,
    params: options,
    attempt: 0,
    callback: done
  });
};

VkApi.prototype.process = function() {
  if (this.queue.length > 0) {
    this.atom.value.process(this.queue[0], (err, data, req) => {
      var res = new Response(err, data);

      if (res.tooManyRequests() || res.captchaNeeded()) {
        this.queue = this.queue.slice(1).concat(req.nextAttempt());
      } else {
        res.send(req.callback);
        this.queue.shift();
      }
    });
  }
};

module.exports = new VkApi({
  rateLimit: 2,
  version: '5.29',
  entryPoint: 'https://api.vk.com/method/',
  atom: new Atom(new UnathorizedApiState())
});
