import { EventEmitter } from 'events';
import React from 'react';
import app from 'app';
import vk from 'app/vk';
import VkCaptchaView from 'app/VkCaptchaView';

export default class VkDriver extends React.Component {
  constructor() {
    super();
    this.state = { inTransaction: false };
  }
  
  componentWillMount() {
    this.tx = new EventEmitter();

    vk.authorize(app.value.get(':db/user'));
    vk.onCaptcha = (captchaUrl) => {
      this.startTransaction(captchaUrl);

      return new Promise((resolve, reject) => {
        this.tx.once('commit', (captchaKey) => resolve(captchaKey));
      });
    };
  }

  componentWillUnmount() {
    this.tx.removeAllListeners();
  }

  render() {
    if (this.state.inTransaction) {
      return <VkCaptchaView captchaUrl={this.state.captchaUrl} onEnter={(v) => this.commitTransaction(v)} />;
    }

    return <div />;
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
}
