import merge from 'app/merge';
import Request from './request';
import Response from './response';
import setupHelpers from './setupHelpers';

function VkApi(attrs) {
  this.interval = 1000 / attrs.rateLimit;
  this.version = attrs.version;
  this.entryPoint = attrs.entryPoint;
  this.state = { isAuthorized: false };
  this.queue = [];
  this.start();
  setupHelpers(this);
}

VkApi.prototype.start = function () {
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

VkApi.prototype.authorize = function (user) {
  this.state = {
    isAuthorized: true,
    user: user.id,
    token: user.accessToken
  };
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

VkApi.prototype.process = function () {
  if (this.state.isAuthorized && this.queue.length > 0) {
    var req = new Request(merge(this.queue[0], {
      token: this.token
    }));

    req.send((err, data) => {
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

export default new VkApi({
  rateLimit: 2,
  version: '5.29',
  entryPoint: 'https://api.vk.com/method/'
});
