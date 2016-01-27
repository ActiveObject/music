import { EventEmitter } from 'events';
import React from 'react';
import app from 'app';
import vk from 'app/vk';
import VkCaptchaView from 'app/VkCaptchaView';

class Transaction extends EventEmitter {
  constructor() {
    super();
    this.state = ':tx/idle';
  }

  isActive() {
    return this.state !== ':tx/idle';
  }

  start(captchaUrl) {
    if (this.state === ':tx/idle') {
      this.state = ':tx/active';
      this.captchaUrl = captchaUrl;
    }
  }

  commit(captchaKey) {
    this.state = ':tx/idle';
    this.emit('commit', captchaKey);
  }
}

export default class VkDriver extends React.Component {
  componentWillMount() {
    this.tx = new Transaction();
    this.tx.on('commit', () => this.forceUpdate());

    vk.authorize(app.value.get(':db/user'));
    vk.onCaptcha = (captchaUrl) => {
      this.tx.start(captchaUrl);
      this.forceUpdate();

      return new Promise((resolve, reject) => {
        this.tx.once('commit', (captchaKey) => resolve(captchaKey));
      });
    };
  }

  componentWillUnmount() {
    this.tx.removeAllListeners();
  }

  render() {
    if (this.tx.isActive()) {
      return <VkCaptchaView captchaUrl={this.tx.captchaUrl} onEnter={(v) => this.tx.commit(v)} />;
    }

    return <div />;
  }
}
