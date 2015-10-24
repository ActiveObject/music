import db from 'app/db';
import updateOnKey from 'app/updateOnKey';
import PlaylistUI from './PlaylistUI';

function PlaylistCtrl() {
  var tracks = db.value.get(':db/tracks')
    .toList()
    .sortBy(t => t.audio.index);

  return <PlaylistUI tracks={tracks} />;
}

export default updateOnKey(PlaylistCtrl, ':db/tracks');
