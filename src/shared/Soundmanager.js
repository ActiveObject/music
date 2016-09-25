import React from 'react';
import { EventEmitter } from 'events';
import { connect } from 'react-redux';
import merge from 'app/shared/merge';
import vk from 'app/shared/vk';
import { toString } from 'app/shared/Track';
import { updatePosition, updateLoading, nextTrack, play, finishSeeking, useTrack } from 'app/playerActions';
import subscribeWith from 'app/shared/subscribeWith';
import emitterOn from 'app/shared/emitterOn';

class Soundmanager extends React.Component {
  componentWillUpdate({ track, isPlaying, isSeeking, seekToPosition, dispatch }) {
    if (isSeeking) {
      dispatch(finishSeeking());
    }

    if (!track) {
      return;
    }

    if (this.track && (track.id !== this.track.id || track.url !== this.track.url)) {
      console.log(`[Soundmanager] destroy audio ${toString(this.track)}`);
      this.destroyAudio();
    }

    if (!this.track || track.id !== this.track.id || track.url !== this.track.url) {
      console.log(`[Soundmanager] create audio ${toString(track)}`);
      this.track = track;
      this.audio = new Audio(track.url);
      this.audio.crossOrigin = 'anonymous';
      this.audio.track = toString(track);
      this.context.audioEmitter.emit('change', this.audio);

      var onStalled = () => {
        console.log(`[Soundmanager] stalled ${toString(track)}`);
        reload(track, dispatch);
      }

      var onTimeUpdate = () => {
        if (!this.props.isSeeking) {
          dispatch(updatePosition(this.audio.currentTime * 1000));
        }
      }

      var onEnded = () => {
        dispatch(nextTrack());
        dispatch(play());
      }

      this.audio.addEventListener('stalled', onStalled, false);
      this.audio.addEventListener('timeupdate', onTimeUpdate, false);
      this.audio.addEventListener('ended', onEnded, false);

      this.destroyAudio = () => {
        this.audio.pause();
        this.audio.src = '';
        this.audio.load();
        this.audio.removeEventListener('stalled', onStalled, false);
        this.audio.removeEventListener('timeupdate', onTimeUpdate, false);
        this.audio.removeEventListener('ended', onEnded, false);
      };
    }

    if (!isPlaying && !this.audio.paused) {
      return this.audio.pause();
    }

    if (isPlaying && this.audio.paused) {
      return this.audio.play();
    }

    if (isSeeking) {
      return this.audio.currentTime = seekToPosition / 1000;
    }
  }

  componentWillUnmount() {
    this.destroyAudio && this.destroyAudio();
  }

  render() {
    return this.props.children;
  }
}

Soundmanager.contextTypes = {
  audioEmitter: React.PropTypes.instanceOf(EventEmitter)
};

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

export class AudioProvider extends React.Component {
  constructor() {
    super();
    this.state = { audio: undefined };
  }

  componentWillMount() {
    this.unsub = subscribeWith(emitterOn, on => {
      on(this.context.audioEmitter, 'change', audio => {
        this.setState({ audio });
      });
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  render() {
    return this.props.children(this.state.audio);
  }
}

AudioProvider.contextTypes = {
  audioEmitter: React.PropTypes.instanceOf(EventEmitter)
};

Soundmanager = connect(state => ({
  isSeeking: state[':player/isSeeking'],
  isPlaying: state[':player/isPlaying'],
  track: state[':player/track'],
  seekToPosition: state[':player/seekToPosition']
}))(Soundmanager);

class AudioContextProvider extends React.Component {
  getChildContext() {
    return {
      audioEmitter: new EventEmitter()
    };
  }

  render() {
    return (<Soundmanager>{this.props.children}</Soundmanager>);
  }
}

AudioContextProvider.childContextTypes = {
  audioEmitter: React.PropTypes.instanceOf(EventEmitter)
};

export default AudioContextProvider;
