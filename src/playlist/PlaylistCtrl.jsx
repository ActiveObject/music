import db from 'app/db';
import updateOnKey from 'app/updateOnKey';
import PlaylistUI from './PlaylistUI';

function PlaylistCtrl() {
  var tracks = db.value.get(':db/tracks')
    .toList()
    .sortBy(t => t.audio.index);

  var ctx = db.value.get(':db/context');

  return <PlaylistUI tracks={tracks} ctx={ctx} />;
}

export default updateOnKey(PlaylistCtrl, [':db/tracks', ':db/context']);
