import React from 'react';

import { connect } from 'react-redux';
import { toggleTrack } from 'app/shared/redux';
import { hasTag } from 'app/shared/Tag';
import Track from './track';

function TrackCtrl({ position, isPlayerEmpty, currentTrack, track, tracklist, dispatch }) {
  var index = tracklist.findIndex(t => t.id === track.id) + 1;
  var isActive = !isPlayerEmpty && track.id === currentTrack.id;

  return (
    <Track
      track={track}
      index={index}
      isActive={isActive}
      position={position}
      onTogglePlay={ (t) => dispatch(toggleTrack(t, tracklist)) } />
  );
}

export default connect(state => ({
  position: state[':player/position'],
  isPlayerEmpty: state[':player/isEmpty'],
  currentTrack: state[':player/track']
}))(TrackCtrl);
