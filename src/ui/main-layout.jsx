import 'app/styles/base.css';
import 'app/styles/theme.css';
import 'app/styles/track.css';
import 'app/styles/playlist.css';
import 'app/styles/command-palette.css';
import 'app/styles/play-btn.css';

import React from 'react';
import { Spring } from 'react-motion';
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
    return (
      <div className='main-layout__play-btn'>
        <PlayBtn
          isActive={true}
          isPlaying={hasTag(db.value.get(':db/player'), ':player/is-playing')}
          onClick={this.togglePlay} />
      </div>
    );
  },

  togglePlay: function () {
    vbus.emit(Player.togglePlay(db.value.get(':db/player')));
  }
}), ':db/player');

var MainLayoutContent = updateOnKey(React.createClass({
  getInitialState: function () {
    return {
      cmd: 'All tracks',
      opened: false
    };
  },

  render: function () {
    var tracks = db.value.get(':db/tracks')
      .toList()
      .sortBy(t => t.audio.index);

    return (
      <Spring
        defaultValue={{
          zoom: { val: 100 },
          y: { val: 0 },
          fontSize: { val: 2 },
          iy: { val: 0 }
        }}

        endValue={{
          zoom: { val: this.state.opened ? 80 : 100 },
          y: { val: this.state.opened ? 300 : 0 },
          fontSize: { val: this.state.opened ? 3 : 2 },
          iy: { val: this.state.opened ? 200 : 0 }
        }}>

        {interpolated =>
          <div className='main-layout'>
            <CommandPalette
              cmd={this.state.cmd}
              style={{
                transform: `translate(0, ${interpolated.iy.val}px)`,
                fontSize: `${interpolated.fontSize.val}rem`
              }}
              onChange={this.executeCommand}
              onFocus={() => this.setState({ opened: true })}
              onBlur={() => this.setState({ opened: false })} />
            <PlaylistUI tracks={tracks} zoom={interpolated.zoom.val} y={interpolated.y.val} />
          </div>
        }
      </Spring>
    );
  },

  executeCommand: function (cmd) {
    this.setState({ cmd: cmd });
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
