import React from 'react';
import app from 'app';
import Atom from 'app/Atom';

class VkCaptchaView extends React.Component {
  render() {
    return (
      <div className='vk-camptha-view'>
        <img src={this.props.url} />
        <input type='text' ref={(c) => this._input = c } />
        <button onClick={() => this.sendCaptcha()}>Send</button>
      </div>
    );
  }

  sendCaptcha() {
    Atom.swap(app, app.value.set(':db/vk', {
      tag: ':vk/captcha-entered',
      captchaKey: this._input.value
    }));
  }
};


export default VkCaptchaView;