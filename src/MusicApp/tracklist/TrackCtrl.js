import React from 'react';
import { connect } from 'react-redux';
import { toggleTrack } from 'app/shared/redux';
import Track from './track';
import { Effect } from 'app/shared/effects';

function TrackCtrl({ position, isPlayerEmpty, currentTrack, track, tracklist }) {
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

export default connect(state => ({
  position: state[':player/position'],
  isPlayerEmpty: state[':player/isEmpty'],
  currentTrack: state[':player/track']
}))(TrackCtrl);
