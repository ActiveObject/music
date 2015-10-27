import db from 'app/db';
import vbus from 'app/vbus';
import updateOn from 'app/updateOn';
import PlaylistUI from './PlaylistUI';

function PlaylistCtrl() {
  var player = db.value.get(':db/player');
  var ctx = db.value.get(':db/context');

  return <PlaylistUI tracks={player.tracklist} ctx={ctx} />;
}

export default updateOn(PlaylistCtrl, ':db/context', dbVal => dbVal.get(':db/player').tracklist);
