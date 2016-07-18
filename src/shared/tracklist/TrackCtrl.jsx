import React from 'react';
import app from 'app';
import { updateOn } from 'app/AppHost';
import * as Player from 'app/shared/Player';
import { hasTag } from 'app/shared/Tag';
import Track from './track';

class TrackCtrl extends React.Component {
  render() {
    var track = this.props.track;
    var tracklist = this.props.tracklist;
    var player = app.value.get(':db/player');
    var index = tracklist.findIndex(t => t.id === track.id) + 1;
    var isActive = !hasTag(player, ':player/empty') && track.id === player.track.id;

    return (
      <Track
        track={track}
        index={index}
        isActive={isActive}
        position={player.position}
        onTogglePlay={ (t) => togglePlay(t, tracklist) } />
    );
  }
}

function togglePlay(track, tracklist) {
  app.push(Player.togglePlay(app.value.get(':db/player'), track, tracklist));
}

export default updateOn(TrackCtrl, function (dbVal, props) {
  var p = dbVal.get(':db/player');
  var isActive = !hasTag(p, ':player/empty') && p.track.id === props.track.id;

  return isActive ? p.position : false;
});
