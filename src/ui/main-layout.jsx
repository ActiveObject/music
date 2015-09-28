import 'app/styles/base.css';
import 'app/styles/theme.css';
import 'app/styles/track.css';
import 'app/styles/playlist.css';
import 'app/styles/command-palette.css';
import 'app/styles/play-btn.css';
import 'app/styles/profile.css';

import React from 'react';

import App from 'app/ui/app';
import CommandPalette from 'app/ui/CommandPalette';
import PlaylistCtrl from 'app/ui/PlaylistCtrl';
import PlayBtnCtrl from 'app/ui/PlayBtnCtrl';
import Profile from 'app/ui/Profile';

var MainLayout = React.createClass({
  render: function() {
    return (
      <App>
        <div className='main-layout'>
          <CommandPalette />
          <PlaylistCtrl />
        </div>

        <div className='main-layout__play-btn'>
          <PlayBtnCtrl />
        </div>

        <div className='main-layout__profile'>
          <Profile />
        </div>
      </App>
    );
  }
});

export default MainLayout;
