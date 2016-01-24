import app from 'app';
import { updateOn } from 'app/renderer';
import * as Player from 'app/Player';
import { hasTag } from 'app/Tag';
import Track from './track';

function TrackCtrl({ track, tracklist }) {
  var player = app.value.get(':db/player');
  var isActive = !hasTag(player, ':player/empty') && track.id === player.track.id;

  return (
     <Track
        track={track}
        isActive={isActive}
        onTogglePlay={ (t) => togglePlay(t, tracklist) } />
  )
}

function togglePlay(track, tracklist) {
  app.push(Player.togglePlay(app.value.get(':db/player'), track, tracklist));
}

export default updateOn(TrackCtrl, function (dbVal) {
  return !(hasTag(dbVal.get(':db/player'), ':player/empty')) && dbVal.get(':db/player').track.id;
});
