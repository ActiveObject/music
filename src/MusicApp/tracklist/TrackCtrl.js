import React from 'react';
import { connect } from 'react-redux';
import { toggleTrack } from 'app/shared/redux';
import Track from './track';
import { Effect } from 'app/shared/effects';

class TrackCtrl extends React.Component {
  state = {
    position: 0
  }

  onTimeUpdate = () => {
    this.setState({
      position: this.props.audio.currentTime * 1000
    });
  }

  componentDidMount() {
    this.connect(this.props.audio);
  }

  componentDidUpdate({ audio }) {
    this.disconnect(audio);
    this.connect(this.props.audio);
  }

  componentWillUnmount() {
    this.disconnect(this.props.audio);
  }

  disconnect(audio) {
    audio.removeEventListener('timeupdate', this.onTimeUpdate, false);
  }

  connect(audio) {
    audio.addEventListener('timeupdate', this.onTimeUpdate, false);
  }

  render() {
    var { audio, isPlayerEmpty, currentTrack, track, tracklist } = this.props;
    var { position } = this.state;
    var index = tracklist.findIndex(t => t.id === track.id) + 1;
    var isActive = !isPlayerEmpty && track.id === currentTrack.id;

    return (
      <Effect>
        {run =>
          <Track
            track={track}
            index={index}
            isActive={isActive}
            position={position}
            onTogglePlay={() => run(toggleTrack(track, tracklist))} />
        }
      </Effect>
    );
  }
}

export default connect(state => ({
  isPlayerEmpty: state[':player/isEmpty'],
  currentTrack: state[':player/track']
}))(TrackCtrl);
