import app from 'app';
import { updateOn } from 'app/renderer';
import PlaylistUI from './PlaylistUI';

function PlaylistCtrl() {
  var player = app.value.get(':db/player');
  var ctx = app.value.get(':db/context');

  return <PlaylistUI tracks={player.tracklist} ctx={ctx} />;
}

export default updateOn(PlaylistCtrl, ':db/context', dbVal => dbVal.get(':db/player').tracklist);
