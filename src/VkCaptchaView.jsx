import React from 'react';
import './VkCaptchaView.css';

class VkCaptchaView extends React.Component {
  render() {
    return (
      <div className='vk-captcha-view'>
        <img src={this.props.captchaUrl} />
        <input type='text' ref={(c) => this._input = c } />
        <button onClick={() => this.props.onEnter(this._input.value)}>Send</button>
      </div>
    );
  }
};

VkCaptchaView.propTypes = {
  captchaUrl: React.PropTypes.string.isRequired,
  onEnter: React.PropTypes.func.isRequired
};

export default VkCaptchaView;
