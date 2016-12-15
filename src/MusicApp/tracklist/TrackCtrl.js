import React from 'react';
import { toggleTrack } from 'app/effects';
import Track from './track';
import { Effect } from 'app/shared/effects';

class TrackCtrl extends React.Component {
  state = {
    currentTime: 0
  }

  onTimeUpdate = () => {
    this.setState({
      currentTime: this.props.audio.currentTime
    });
  }

  componentWillUpdate({ audio }) {
    if (audio !== this.props.audio) {
      this.setState({ currentTime: 0 });
    }
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
    if (audio) {
      audio.removeEventListener('timeupdate', this.onTimeUpdate, false);
    }
  }

  connect(audio) {
    if (audio) {
      audio.addEventListener('timeupdate', this.onTimeUpdate, false);
    }
  }

  render() {
    var { audio, currentTrack, track, tracklist } = this.props;
    var { currentTime } = this.state;
    var index = track ? tracklist.findIndex(t => t.id === track.id) + 1 : 0;
    var isActive = currentTrack ? track.id === currentTrack.id : false;

    return (
      <Effect nowrap>
        {run =>
          <Track
            track={track}
            index={index}
            isActive={isActive}
            position={currentTime * 1000}
            onTogglePlay={() => run(toggleTrack(track, tracklist))} />
        }
      </Effect>
    );
  }
}

export default TrackCtrl;
