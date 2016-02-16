import React from 'react';
import emitterOn from 'app/emitterOn';
import subscribeWith from 'app/subscribeWith';
import driver from './driver';

class Sound extends React.Component {
  componentWillMount() {
    this.unsub = subscribeWith(emitterOn, (emitterOn) => {
      emitterOn(driver, 'finish', (track) => {
        if (track.id === this.props.track.id) {
          if (typeof this.props.onFinish === 'function') {
            this.props.onFinish();
          }
        }
      });

      emitterOn(driver, 'error', (err) => {
        if (err.track.id === this.props.track.id) {
          if (typeof this.props.onError === 'function') {
            this.props.onError(err);
          }
        }
      });
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  render() {
    return this.props.children;
  }
}

Sound.propTypes = {
  track: React.PropTypes.object.isRequired,
  onFinish: React.PropTypes.func,
  onError: React.PropTypes.func
};

export default Sound;
