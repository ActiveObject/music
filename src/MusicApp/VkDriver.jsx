import { EventEmitter } from 'events';
import React from 'react';
import { connect } from 'react-redux';
import app from 'app';
import vk from 'app/shared/vk';
import merge from 'app/shared/merge';
import { addTag } from 'app/shared/Tag';
import VkCaptchaView from './VkCaptchaView';
import { loaded } from 'app/userActions';

class VkDriver extends React.Component {
  constructor() {
    super();
    this.state = { inTransaction: false };
  }

  componentWillMount() {
    this.tx = new EventEmitter();
    var user = this.props.user;

    vk.authorize(user);
    vk.onCaptcha = (captchaUrl) => {
      this.startTransaction(captchaUrl);

      return new Promise((resolve, reject) => {
        this.tx.once('commit', (captchaKey) => resolve(captchaKey));
      });
    };

    vk.users.get({
      user_ids: user.id,
      fields: ['photo_50']
    }, (err, result) => {
      if (err) {
        return console.log(err);
      }

      this.props.dispatch(loaded(result.response[0]));
    });
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

export default connect(state => ({ user: state.user }))(VkDriver);
