import React from 'react';
import db from 'app/db';
import updateOnKey from 'app/fn/updateOnKey';
import PlaylistUI from './PlaylistUI';

var PlaylistCtrl = React.createClass({
  render: function () {
    var tracks = db.value.get(':db/tracks')
      .toList()
      .sortBy(t => t.audio.index);

    return <PlaylistUI tracks={tracks} />
  }
});

export default updateOnKey(PlaylistCtrl, ':db/tracks');
