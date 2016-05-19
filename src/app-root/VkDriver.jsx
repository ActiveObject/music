import { EventEmitter } from 'events';
import React from 'react';
import app from 'app';
import vk from 'app/vk';
import merge from 'app/shared/merge';
import { addTag } from 'app/shared/Tag';
import VkCaptchaView from './VkCaptchaView';

export default class VkDriver extends React.Component {
  constructor() {
    super();
    this.state = { inTransaction: false };
  }

  componentWillMount() {
    this.tx = new EventEmitter();
    var user = app.value.get(':db/user');

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
    }, function (err, result) {
      if (err) {
        return console.log(err);
      }

      var res = result.response[0];

      var u = merge(app.value.get(':db/user'), {
        photo50: res.photo_50,
        firstName: res.first_name,
        lastName: res.last_name
      });

      app.push(addTag(u, ':user/is-loaded'));
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
