import 'app/styles/base.css';
import 'app/styles/theme.css';
import 'app/styles/track.css';
import 'app/styles/playlist.css';
import 'app/styles/command-palette.css'

import React from 'react';
import { Spring } from 'react-motion';
import db from 'app/db';
import updateOnKey from 'app/fn/updateOnKey';

import App from 'app/ui/app';
import PlaylistUI from 'app/ui/PlaylistUI';
import CommandPalette from 'app/ui/CommandPalette';

var MainLayout = React.createClass({
  getInitialState: function () {
    return {
      cmd: 'All tracks',
      opened: false
    };
  },

  render: function() {
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
          y: { val: this.state.opened ? 500 : 0 },
          fontSize: { val: this.state.opened ? 3 : 2 },
          iy: { val: this.state.opened ? 300 : 0 }
        }}>

        {interpolated =>
          <App>
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
          </App>
        }
      </Spring>
    );
  },

  executeCommand: function (cmd) {
    this.setState({ command: cmd });
  }
});

export default updateOnKey(MainLayout, ':db/tracks');
