import app from 'app';
import vbus from 'app/vbus';
import { updateOn } from 'app/renderer';
import * as Player from 'app/Player';
import Track from './track';

function TrackCtrl({ track, tracklist }) {
  var player = app.value.get(':db/player');
  var isActive = track.id === player.track.id;

  return (
     <Track
        track={track}
        isActive={isActive}
        onTogglePlay={ (t) => togglePlay(t, tracklist) } />
  )
}

function togglePlay(track, tracklist) {
  vbus.push(Player.togglePlay(app.value.get(':db/player'), track, tracklist));
}

export default updateOn(TrackCtrl, dbVal => dbVal.get(':db/player').track.id);
