import 'app/styles/base.css';
import 'app/styles/theme.css';
import 'app/styles/track.css';
import 'app/styles/playlist.css';
import 'app/styles/command-palette.css'

import React from 'react';
import db from 'app/db';
import App from 'app/ui/app';
import updateOnKey from 'app/fn/updateOnKey';
import PlaylistUI from 'app/ui/PlaylistUI';

var MainLayout = React.createClass({
  render: function() {
    var tracks = db.value.get(':db/tracks')
      .toList()
      .sortBy(t => t.audio.index);

    return (
      <App>
        <PlaylistUI name='All tracks' tracks={tracks} />
      </App>
    );
  }
});

export default updateOnKey(MainLayout, ':db/tracks');
