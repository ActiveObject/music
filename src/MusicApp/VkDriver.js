import { EventEmitter } from 'events';
import React from 'react';
import { connect } from 'react-redux';
import vk from 'app/shared/vk';
import merge from 'app/shared/merge';
import { addTag } from 'app/shared/Tag';
import VkCaptchaView from './VkCaptchaView';

class VkDriver extends React.Component {
  constructor() {
    super();
    this.state = { inTransaction: false };
  }

  componentWillMount() {
    var { userId, accessToken } = this.props;

    this.tx = new EventEmitter();

    vk.authorize(userId, accessToken);
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

    return null;
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

export default connect(state => ({
  userId: state[':app/userId'],
  accessToken: state[':app/accessToken']
}))(VkDriver);
