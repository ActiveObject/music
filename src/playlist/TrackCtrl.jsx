import db from 'app/db';
import vbus from 'app/vbus';
import updateOn from 'app/updateOn';
import * as Player from 'app/Player';
import Track from './track';

function TrackCtrl({ track, tracklist }) {
  var player = db.value.get(':db/player');
  var isActive = track.id === player.track.id;

  return (
     <Track
        track={track}
        isActive={isActive}
        onTogglePlay={ (t) => togglePlay(t, tracklist) } />
  )
}

function togglePlay(track, tracklist) {
  vbus.push(Player.togglePlay(db.value.get(':db/player'), track, tracklist));
}

export default updateOn(TrackCtrl, dbVal => dbVal.get(':db/player').track.id);
