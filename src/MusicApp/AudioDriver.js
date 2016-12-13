import React from 'react';
import merge from 'app/shared/merge';
import vk from 'app/shared/vk';
import { toString } from 'app/shared/Track';
import {
  nextTrack,
  useTrack,
  PLAYER_TOGGLE_TRACK,
  PLAYER_REWIND,
  PLAYER_FORWARD,
  PLAYER_TOGGLE_PLAY,
  PLAYER_VOLUME_UP,
  PLAYER_VOLUME_DOWN
} from 'app/effects';
import { showMediaError, MEDIA_ERR_SRC_NOT_SUPPORTED } from 'app/shared/MediaError';
import { EffectComponent, EffectHandler } from 'app/shared/effects';

class AudioDriver extends EffectComponent {
  state = {
    audio: null,
    isPlaying: false,
    volume: 100
  }

  onToggleTrack = () => {
    console.log(`[AudioDriver] toggleTrack`);
    this.setState({ isPlaying: true });
  }

  onForward = ({ ms }) => {
    console.log(`[AudioDriver] forward ${ms / 1000}s`);
    if (this.audio) {
      this.audio.currentTime += ms / 1000;
    }
  }

  onRewind = ({ ms }) => {
    console.log(`[AudioDriver] rewind ${ms / 1000}s`);
    if (this.audio) {
      this.audio.currentTime -= ms / 1000;
    }
  }

  onTogglePlay = () => {
    console.log(`[AudioDriver] toggle play`);
    if (this.audio) {
      this.setState({ isPlaying: !this.state.isPlaying });
    }
  }

  onVolumeUp = () => {
    if (this.state.volume < 100) {
      var volume = this.state.volume + 10;

      this.setState({
        volume: volume < 100 ? volume : 100
      });
    }
  }

  onVolumeDown = () => {
    if (this.state.volume > 0) {
      var volume = this.state.volume - 10;

      this.setState({
        volume: volume > 0 ? volume : 0
      });
    }
  }

  componentDidUpdate() {
    var { track } = this.props;
    var { isPlaying } = this.state;

    if (!track) {
      return;
    }

    if (this.track && (track.id !== this.track.id || track.url !== this.track.url)) {
      console.log(`[AudioDriver] destroy audio ${toString(this.track)}`);
      this.destroyAudio();
    }

    if (!this.track || track.id !== this.track.id || track.url !== this.track.url) {
      console.log(`[AudioDriver] create audio ${toString(track)}`);
      this.track = track;
      this.audio = new Audio(track.url);
      this.audio.crossOrigin = 'anonymous';
      this.audio.track = toString(track);
      this.setState({ audio: this.audio });

      var onStalled = () => {
        console.log(`[AudioDriver] stalled ${toString(track)}`);
        this.perform(reload(track, this.perform.bind(this)));
      }

      var onEnded = () => {
        this.perform(nextTrack());
        // this.perform(play());
      }

      var onError = (e) => {
        console.log(`[AudioDriver] ${showMediaError(this.audio.error.code)}`);

        if (this.audio.error.code === MEDIA_ERR_SRC_NOT_SUPPORTED) {
          this.perform(reload(track, this.perform.bind(this)));
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

    this.audio.volume = this.state.volume / 100;
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
      <EffectHandler type={PLAYER_VOLUME_UP} onEffect={this.onVolumeUp}>
      <EffectHandler type={PLAYER_VOLUME_DOWN} onEffect={this.onVolumeDown}>
        {this.props.children(this.state)}
      </EffectHandler>
      </EffectHandler>
      </EffectHandler>
      </EffectHandler>
      </EffectHandler>
      </EffectHandler>
    )
  }
}

function reload(track, run) {
  console.log(`[AudioDriver] fetch url for ${toString(track)}`);

  return fetchUrl(track, (err, res) => {
    if (err) {
      return console.log(err);
    }

    run(useTrack(merge(track, {
      url: res.response[0]
    })));
  });
}

function fetchUrl(audio, callback) {
  return vk.execute({
    code: `
      return API.audio.getById({ audios: "${audio.owner}_${audio.id}" })@.url;
    `
  }, callback);
}

export default AudioDriver;
