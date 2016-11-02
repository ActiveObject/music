import merge from 'app/shared/merge';
import Request from './request';
import Response from './response';
import setupHelpers from './setupHelpers';

function VkApi({ rateLimit, version }) {
  this.interval = 1000 / rateLimit;
  this.version = version;
  this.entryPoint = 'https://api.vk.com/method/';
  this.state = {
    isAuthorized: false,
    isWaitingForCaptcha: false
  };
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

VkApi.prototype.authorize = function (userId, accessToken) {
  this.state = {
    isAuthorized: true,
    user: userId,
    token: accessToken
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
  if (this.state.isAuthorized && !this.state.isWaitingForCaptcha && this.queue.length > 0) {
    var reqParams = this.queue.shift();
    var req = new Request(merge(reqParams, {
      token: this.state.token
    }));

    req.send((err, data) => {
      var res = new Response(err, data);

      if (res.tooManyRequests()) {
        this.queue.push(req.nextAttempt());
      } else if (res.captchaNeeded() && typeof this.onCaptcha === 'function') {
        if (!this.state.isWaitingForCaptcha) {
          this.state.isWaitingForCaptcha = true;

          this.onCaptcha(err.captcha_img).then((captchaKey) => {
            this.queue.push(merge(reqParams, {
              params: merge(reqParams.params, {
                captcha_key: captchaKey,
                captcha_sid: err.captcha_sid
              })
            }));

            this.state.isWaitingForCaptcha = false;
          });
        }
      } else {
        res.send(req.callback);
      }
    });
  }
};

export default new VkApi({
  rateLimit: 2,
  version: '5.29'
});
