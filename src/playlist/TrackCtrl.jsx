import db from 'app/db';
import vbus from 'app/vbus';
import updateOnKey from 'app/updateOnKey';
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
  vbus.emit(Player.togglePlay(db.value.get(':db/player'), track, tracklist));
}

export default updateOnKey(TrackCtrl, function (dbVal) {
  return dbVal.get(':db/player').track.id;
});
