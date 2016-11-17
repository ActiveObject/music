import { EventEmitter } from 'events';
import React from 'react';
import merge from 'app/shared/merge';
import Request from 'app/shared/vk/request';
import Response from 'app/shared/vk/response';

class VkDriver extends React.Component {
  state = {
    inTransaction: false,
    interval: 1000 / 2,
    version: '5.29',
    entryPoint: 'https://api.vk.com/method/',
    state: {
      isAuthorized: false,
      isWaitingForCaptcha: false
    },
    queue: []
  }

  componentWillMount() {
    var { userId, accessToken, vk } = this.props;

    this.tx = new EventEmitter();

    vk.push = req => {
      this.setState(({ queue }) => ({
        queue: queue.concat(req)
      }));
    };

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
        <div style={style}>
          <img src={this.state.captchaUrl} />
          <input type='text' ref={(c) => this._input = c } />
          <button onClick={() => this.commitTransaction(this._input.value)}>Send</button>
        </div>
      );
    }

    return this.props.children;
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
        version: this.state.version,
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

export default VkDriver;
