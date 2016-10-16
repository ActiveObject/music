import { EventEmitter } from 'events';
import React from 'react';
import merge from 'app/shared/merge';

class VkDriver extends React.Component {
  state = {
    inTransaction: false
  }

  componentWillMount() {
    var { userId, accessToken, vk } = this.props;

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

export default VkDriver;
