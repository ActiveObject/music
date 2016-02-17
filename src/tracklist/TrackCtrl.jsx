import React from 'react';
import app from 'app';
import { updateOn } from 'app/renderer';
import * as Player from 'app/Player';
import { hasTag } from 'app/Tag';
import Sound from 'app/soundmanager/Sound';
import Track from './track';

class TrackCtrl extends React.Component {
  render() {
    var track = this.props.track;
    var tracklist = this.props.tracklist;
    var player = app.value.get(':db/player');
    var index = tracklist.findIndex(t => t.id === track.id) + 1;
    var isActive = !hasTag(player, ':player/empty') && track.id === player.track.id;

    return (
      <Sound track={track} onFinish={() => nextTrack(tracklist)}>
        <Track
          track={track}
          index={index}
          isActive={isActive}
          onTogglePlay={ (t) => togglePlay(t, tracklist) } />
      </Sound>
    );
  }
}

function togglePlay(track, tracklist) {
  app.push(Player.togglePlay(app.value.get(':db/player'), track, tracklist));
}

function nextTrack(tracklist) {
  app.push(
    Player.play(
      Player.nextTrack(app.value.get(':db/player'), tracklist)));
}

export default updateOn(TrackCtrl, function (dbVal) {
  return !(hasTag(dbVal.get(':db/player'), ':player/empty')) && dbVal.get(':db/player').track.id;
});
