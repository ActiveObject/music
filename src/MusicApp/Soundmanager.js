import React from 'react';
import { connect } from 'react-redux';
import merge from 'app/shared/merge';
import vk from 'app/shared/vk';
import { toString } from 'app/shared/Track';
import {
  updateLoading,
  nextTrack,
  play,
  useTrack,
  toggleTrack, PLAYER_TOGGLE_TRACK,
  PLAYER_REWIND,
  PLAYER_FORWARD,
  togglePlay, PLAYER_TOGGLE_PLAY
} from 'app/shared/redux';
import subscribeWith from 'app/shared/subscribeWith';
import emitterOn from 'app/shared/emitterOn';
import { showMediaError, MEDIA_ERR_SRC_NOT_SUPPORTED } from 'app/shared/MediaError';
import { EffectComponent, EffectHandler } from 'app/shared/effects';

class Soundmanager extends EffectComponent {
  state = {
    audio: null
  }

  onToggleTrack = ({ track, tracklist }) => {
    this.props.dispatch(toggleTrack(track, tracklist));
  }

  onForward = ({ ms }) => {
    console.log(`[Soundmanager] forward ${ms}ms`);
    if (this.audio) {
      this.audio.currentTime += ms / 1000;
    }
  }

  onRewind = ({ ms }) => {
    console.log(`[Soundmanager] rewind ${ms}s`);
    if (this.audio) {
      this.audio.currentTime -= ms / 1000;
    }
  }

  onTogglePlay = () => {
    console.log(`[Soundmanager] toggle play`);
    this.props.dispatch(togglePlay());
  }

  componentWillUpdate({ track, isPlaying, dispatch }) {
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
      this.setState({ audio: this.audio });

      var onStalled = () => {
        console.log(`[Soundmanager] stalled ${toString(track)}`);
        this.perform(reload(track, dispatch));
      }

      var onEnded = () => {
        dispatch(nextTrack());
        dispatch(play());
      }

      var onError = (e) => {
        console.log(`[Soundmanager] ${showMediaError(this.audio.error.code)}`);

        if (this.audio.error.code === MEDIA_ERR_SRC_NOT_SUPPORTED) {
          this.perform(reload(track, dispatch));
        }
      }

      this.audio.addEventListener('stalled', onStalled, false);
      this.audio.addEventListener('ended', onEnded, false);
      this.audio.addEventListener('error', onError, false);

      this.destroyAudio = () => {
        this.audio.pause();
        this.audio.src = '';
        this.audio.load();
        this.audio.removeEventListener('stalled', onStalled, false);
        this.audio.removeEventListener('ended', onEnded, false);
        this.audio.removeEventListener('error', onError, false);
      };
    }

    if (!isPlaying && !this.audio.paused) {
      return this.audio.pause();
    }

    if (isPlaying && this.audio.paused) {
      return this.audio.play();
    }
  }

  componentWillUnmount() {
    this.destroyAudio && this.destroyAudio();
  }

  render() {
    return (
      <EffectHandler type={PLAYER_TOGGLE_TRACK} onEffect={this.onToggleTrack}>
      <EffectHandler type={PLAYER_FORWARD} onEffect={this.onForward}>
      <EffectHandler type={PLAYER_REWIND} onEffect={this.onRewind}>
      <EffectHandler type={PLAYER_TOGGLE_PLAY} onEffect={this.onTogglePlay}>
        {this.props.children(this.state)}
      </EffectHandler>
      </EffectHandler>
      </EffectHandler>
      </EffectHandler>
    )
  }
}

function reload(track, dispatch) {
  console.log(`[Soundmanager] fetch url for ${toString(track)}`);

  return fetchUrl(track, (err, res) => {
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
  return vk.execute({
    code: `
      return API.audio.getById({ audios: "${audio.owner}_${audio.id}" })@.url;
    `
  }, callback);
}

Soundmanager = connect(state => ({
  isPlaying: state[':player/isPlaying'],
}))(Soundmanager);

export default Soundmanager;
