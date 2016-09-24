import React from 'react';

import { connect } from 'react-redux';
import { toggleTrack } from 'app/playerActions';
import { hasTag } from 'app/shared/Tag';
import Track from './track';

function TrackCtrl({ player, track, tracklist, dispatch }) {
  var index = tracklist.findIndex(t => t.id === track.id) + 1;
  var isActive = !hasTag(player, ':player/empty') && track.id === player.track.id;

  return (
    <Track
      track={track}
      index={index}
      isActive={isActive}
      position={player.position}
      onTogglePlay={ (t) => dispatch(toggleTrack(t, tracklist)) } />
  );
}

export default connect(state => ({ player: state.player }))(TrackCtrl);
