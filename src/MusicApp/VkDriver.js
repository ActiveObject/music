import Url from 'url';
import React from 'react';
import ReactDOM from 'react-dom';
import request from 'jsonp';
import merge from 'app/shared/merge';
import { EffectHandler } from 'app/shared/effects';
import { VK_REQUEST } from 'app/shared/vk';

class VkDriver extends React.Component {
  static propTypes = {
    userId: React.PropTypes.string.isRequired,
    accessToken: React.PropTypes.string.isRequired,
    apiVersion: React.PropTypes.string.isRequired,
    interval: React.PropTypes.number,
    entryPoint: React.PropTypes.string
  }

  static defaultProps = {
    interval: 1000 / 5,
    entryPoint: 'https://api.vk.com/method/',
  }

  state = {
    isWaitingForCaptcha: false,
    queue: []
  }

  componentWillMount() {
    var nextTick = () => {
      this.timer = setTimeout(() => {
        this.process();
        nextTick();
      }, this.props.interval);
    }

    nextTick();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    if (this.state.isWaitingForCaptcha) {
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
        <EffectHandler type={VK_REQUEST} onEffect={e => this.enqueRequest(e)}>
          <div style={style}>
            <img src={this.state.captchaUrl} />
            <input type='text' ref={(c) => this._input = c } />
            <button onClick={() => this.resume(this._input.value)}>Send</button>
          </div>
        </EffectHandler>
      );
    }

    return (
      <EffectHandler type={VK_REQUEST} onEffect={e => this.enqueRequest(e)}>
        {this.props.children}
      </EffectHandler>
    );
  }

  enqueRequest(req) {
    this.setState(({ queue }) => ({
      queue: queue.concat(req)
    }));
  }

  process() {
    if (!this.state.isWaitingForCaptcha && this.state.queue.length > 0) {
      var { accessToken, apiVersion, entryPoint } = this.props;
      var reqParams = this.state.queue[0];
      var req = new Request(merge(reqParams, {
        entryPoint,
        token: accessToken,
        version: apiVersion
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
            this.pauseOnCaptcha(err.captcha_img, err.captcha_sid, reqParams);
          } else {
            res.send(req.callback);
          }
        });
      });
    }
  }

  pauseOnCaptcha(captchaUrl, captchaSid, reqParams) {
    if (!this.state.isWaitingForCaptcha) {
      this.setState({
        reqParams,
        captchaSid,
        captchaUrl,
        isWaitingForCaptcha: true,
      });
    }
  }

  resume(captchaKey) {
    var { reqParams } = this.state;

    this.setState(({ queue, captchaSid }) => ({
      queue: queue.concat(merge(reqParams, {
        params: merge(reqParams.params, {
          captcha_key: captchaKey,
          captcha_sid: captchaSid
        })
      })),

      isWaitingForCaptcha: false,
      reqParams: null,
      captchaSid: null,
      captchaUrl: null
    }));
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
