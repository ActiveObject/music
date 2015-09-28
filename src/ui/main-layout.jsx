import 'app/styles/base.css';
import 'app/styles/theme.css';
import 'app/styles/track.css';
import 'app/styles/playlist.css';
import 'app/styles/command-palette.css';
import 'app/styles/play-btn.css';

import React from 'react';
import db from 'app/db';
import vbus from 'app/core/vbus';
import updateOnKey from 'app/fn/updateOnKey';
import hasTag from 'app/fn/hasTag';
import * as Player from 'app/values/player';

import App from 'app/ui/app';
import PlaylistUI from 'app/ui/PlaylistUI';
import CommandPalette from 'app/ui/CommandPalette';
import PlayBtn from 'app/ui/PlayBtn';

var MainLayoutPlayBtn = updateOnKey(React.createClass({
  render: function () {
    var isPlaying = hasTag(db.value.get(':db/player'), ':player/is-playing');

    return (
      <div className='main-layout__play-btn'>
        <PlayBtn isPlaying={isPlaying} onClick={this.togglePlay} />
      </div>
    );
  },

  togglePlay: function () {
    vbus.emit(Player.togglePlay(db.value.get(':db/player')));
  }
}), ':db/player');

var MainLayoutContent = updateOnKey(React.createClass({
  render: function () {
    var tracks = db.value.get(':db/tracks')
      .toList()
      .sortBy(t => t.audio.index);

    return (
      <div className='main-layout'>
        <CommandPalette />
        <PlaylistUI tracks={tracks} />
      </div>
    );
  }
}), ':db/tracks');

export default React.createClass({
  render: function() {
    return (
      <App>
        <MainLayoutContent />
        <MainLayoutPlayBtn />
      </App>
    );
  }
});
