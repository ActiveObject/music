import React from 'react';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import subscribeWith from 'app/shared/subscribeWith';
import emitterOn from 'app/shared/emitterOn';
import { hasTag, removeTag } from 'app/shared/Tag';
import merge from 'app/shared/merge';
import SoundDriver from './SoundDriver';
import vk from 'app/shared/vk';
import { toString } from 'app/shared/Track';
import { updatePosition, updateLoading, nextTrack, play, finishSeeking, useTrack } from 'app/playerActions';

class Soundmanager extends React.Component {
  componentWillMount() {
    this.unsub = subscribeWith(emitterOn, (on) => {
      on(SoundDriver, 'whileplaying', (position) => {
        if (!this.props.isSeeking) {
          this.props.dispatch(updatePosition(position));
        }
      });

      on(SoundDriver, 'whileloading', (bytesLoaded, bytesTotal) => {
        this.props.dispatch(updateLoading(bytesLoaded, bytesTotal));
      });

      on(SoundDriver, 'finish', () => {
        this.props.dispatch(nextTrack());
        this.props.dispatch(play());
      });

      on(SoundDriver, 'error', err => reload(err.track, this.props.dispatch));
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  componentWillUpdate({ track, isPlaying, isSeeking, seekToPosition, dispatch }) {
    if (isSeeking) {
      dispatch(finishSeeking());
    }

    SoundDriver.tick(track, isPlaying, isSeeking, seekToPosition);
  }

  render() {
    return null;
  }
}

function reload(track, dispatch) {
  console.log(`[TrackCtrl] fetch url for ${toString(track)}`);

  fetchUrl(track, (err, res) => {
    if (err) {
      return console.log(err);
    }

    dispatch(useTrack(merge(track, {
      url: res.response[0]
    })));

    dispatch(play());
  });
}

function fetchUrl(audio, callback) {
  vk.execute({
    code: `
      return API.audio.getById({ audios: "${audio.owner}_${audio.id}" })@.url;
    `
  }, callback);
}

export default connect(state => ({
  isSeeking: state[':player/isSeeking'],
  isPlaying: state[':player/isPlaying'],
  track: state[':player/track'],
  seekToPosition: state[':player/seekToPosition']
}))(Soundmanager);
