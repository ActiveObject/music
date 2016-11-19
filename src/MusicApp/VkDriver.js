import { EventEmitter } from 'events';
import Url from 'url';
import React from 'react';
import ReactDOM from 'react-dom';
import request from 'jsonp';
import merge from 'app/shared/merge';
import { EffectHandler } from 'app/shared/effects';

class VkDriver extends React.Component {
  state = {
    inTransaction: false,
    interval: 1000 / 2,
    entryPoint: 'https://api.vk.com/method/',
    isWaitingForCaptcha: false,
    queue: []
  }

  componentWillMount() {
    this.tx = new EventEmitter();

    var nextTick = () => {
      this.timer = setTimeout(() => {
        this.process();
        nextTick();
      }, this.state.interval);
    }

    nextTick();
  }

  onCaptcha(captchaUrl) {
    this.startTransaction(captchaUrl);

    return new Promise((resolve, reject) => {
      this.tx.once('commit', (captchaKey) => resolve(captchaKey));
    });
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.tx.removeAllListeners();
  }

  render() {
    if (this.state.inTransaction) {
      var style = {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 100,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      };

      return (
        <EffectHandler type="vk-request" onEffect={e => this.enqueRequest(e)}>
          <div style={style}>
            <img src={this.state.captchaUrl} />
            <input type='text' ref={(c) => this._input = c } />
            <button onClick={() => this.commitTransaction(this._input.value)}>Send</button>
          </div>
        </EffectHandler>
      );
    }

    return (
      <EffectHandler type="vk-request" onEffect={e => this.enqueRequest(e)}>
        {this.props.children}
      </EffectHandler>
    );
  }

  enqueRequest({ detail }) {
    this.setState(({ queue }) => ({
      queue: queue.concat(detail)
    }));
  }

  startTransaction(captchaUrl) {
    if (!this.state.inTransaction) {
      this.setState({
        inTransaction: true,
        captchaUrl
      });
    }
  }

  commitTransaction(captchaKey) {
    this.tx.emit('commit', captchaKey);
    this.setState({ inTransaction: false, captchaUrl: '' });
  }

  process() {
    if (!this.state.isWaitingForCaptcha && this.state.queue.length > 0) {
      var reqParams = this.state.queue[0];
      var req = new Request(merge(reqParams, {
        token: this.props.accessToken,
        version: this.props.apiVersion,
        entryPoint: this.state.entryPoint
      }));

      this.setState({
        queue: this.state.queue.slice(1)
      }, () => {
        req.send((err, data) => {
          var res = new Response(err, data);

          if (res.tooManyRequests()) {
            this.setState(({ queue }) => {
              queue: queue.concat(req.nextAttempt())
            });
          } else if (res.captchaNeeded()) {
            if (!this.state.isWaitingForCaptcha) {
              this.setState({
                isWaitingForCaptcha: true
              });

              this.onCaptcha(err.captcha_img).then((captchaKey) => {
                this.setState(({ queue }) => ({
                  queue: queue.concat(merge(reqParams, {
                    params: merge(reqParams.params, {
                      captcha_key: captchaKey,
                      captcha_sid: err.captcha_sid
                    })
                  })),

                  isWaitingForCaptcha: false
                }));
              });
            }
          } else {
            res.send(req.callback);
          }
        });
      });
    }
  }
}

function Request(attrs) {
  this.entryPoint = attrs.entryPoint;
  this.token = attrs.token;
  this.callback = attrs.callback;
  this.attempt = attrs.attempt;
  this.method = attrs.method;
  this.params = attrs.params;
  this.version = attrs.version;

  this.url = Url.format({
    protocol: Url.parse(this.entryPoint).protocol,
    host: Url.parse(this.entryPoint).host,
    pathname: Url.parse(this.entryPoint).pathname + this.method,
    query: merge(this.params, {
      access_token: this.token,
      v: this.version
    })
  });
};

Request.prototype.send = function (callback) {
  request(this.url, function (err, data) {
    if (err) {
      return callback(err);
    }


    if (data.error) {
      return callback(data.error);
    }

    if (!data.response) {
      return callback(new Error('Missing response body'));
    }

    callback(null, data);
  });
};

Request.prototype.nextAttempt = function() {
  return this.modify({
    attempt: this.attempt + 1
  });
};

Request.prototype.modify = function(attrs) {
  return new Request(merge(this, attrs));
};

function Response(err, data) {
  this.err = err;
  this.data = data;
}

Response.TOO_MANY_REQUESTS = 6;
Response.CAPTCHA_NEEDED = 14;

Response.prototype.send = function(callback) {
  if (this.tooManyRequests() || this.captchaNeeded()) {
    return callback(this.err);
  }

  if (this.err) {
    callback(this.err);
  } else {
    callback(null, this.data);
  }

  return this;
};

Response.prototype.tooManyRequests = function() {
  return this.err && this.err.error_code === Response.TOO_MANY_REQUESTS;
};

Response.prototype.captchaNeeded = function() {
  return this.err && this.err.error_code === Response.CAPTCHA_NEEDED;
};

export default VkDriver;
