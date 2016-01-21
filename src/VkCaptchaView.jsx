import React from 'react';
import app from 'app';
import Atom from 'app/Atom';
import { updateOn } from 'app/renderer';
import { hasTag } from 'app/Tag';
import './VkCaptchaView.css';

class VkCaptchaView extends React.Component {
  render() {
    var vk = app.value.get(':db/vk');

    if (hasTag(vk, ':vk/captcha-needed')) {
      return (
        <div className='vk-captcha-view'>
          <img src={vk.captchaUrl} />
          <input type='text' ref={(c) => this._input = c } />
          <button onClick={() => this.sendCaptcha()}>Send</button>
        </div>
      );
    }

    return <div></div>;
  }

  sendCaptcha() {
    Atom.swap(app, app.value.set(':db/vk', {
      tag: ':vk/captcha-entered',
      captchaKey: this._input.value
    }));
  }
};

export default updateOn(VkCaptchaView, [':db/vk']);
