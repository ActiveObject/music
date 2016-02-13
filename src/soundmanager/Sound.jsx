import React from 'react';
import emitterOn from 'app/emitterOn';
import driver from './driver';

class Sound extends React.Component {
  componentWillMount() {
    this.unsub = emitterOn(driver, 'finish', (track) => {
      if (track.id === this.props.track.id) {
        this.props.onFinish();
      }
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
  onFinish: React.PropTypes.func.isRequired
};

export default Sound;
