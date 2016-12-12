import React, { Component } from 'react';
import { EffectHandler } from 'app/shared/effects';
import { PLAYER_TOGGLE_TRACK, PLAYER_PREV_TRACK, PLAYER_NEXT_TRACK, PLAYER_USE_TRACK } from 'app/effects';

export default class PlaylistDriver extends Component {
  state = {
    playlist: this.props.playlist,
    track: this.props.playlist[0]
  }

  onToggleTrack = ({ track, playlist }) => {
    console.log(`[PlaylistDriver] toggleTrack`);
    this.setState({ track, playlist });
  }

  onPrevTrack = () => {
    console.log(`[PlaylistDriver] prevTrack`);
    var { track, playlist } = this.state;
    var activeIndex = playlist.findIndex(t => t.id === track.id);
    var isFirstTrack = activeIndex === 0;

    if (isFirstTrack) {
      console.log(`[PlaylistDriver] first track in playlist`);
    } else {
      this.setState({
        track: playlist[activeIndex - 1]
      });
    }
  }

  onNextTrack = () => {
    console.log(`[PlaylistDriver] nextTrack`);
    var { track, playlist } = this.state;
    var activeIndex = playlist.findIndex(t => t.id === track.id);
    var isLastTrack = activeIndex + 1 === playlist.length;

    if (isLastTrack) {
      console.log(`[PlaylistDriver] last track in playlist`);
    } else {
      this.setState({
        track: playlist[activeIndex + 1]
      });
    }
  }

  onUseTrack = ({ track }) => {
    console.log(`[PlaylistDriver] useTrack`);
    this.setState({ track });
  }

  render() {
    return (
      <EffectHandler type={PLAYER_TOGGLE_TRACK} onEffect={this.onToggleTrack}>
      <EffectHandler type={PLAYER_PREV_TRACK} onEffect={this.onPrevTrack}>
      <EffectHandler type={PLAYER_NEXT_TRACK} onEffect={this.onNextTrack}>
      <EffectHandler type={PLAYER_USE_TRACK} onEffect={this.onUseTrack}>
        {this.props.children(this.state)}
      </EffectHandler>
      </EffectHandler>
      </EffectHandler>
      </EffectHandler>
    )
  }
}
