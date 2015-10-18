import 'app/styles/base.css';
import 'app/styles/theme.css';
import 'app/styles/track.css';
import 'app/styles/playlist.css';
import 'app/styles/command-palette.css';
import 'app/styles/play-btn.css';
import 'app/styles/profile.css';
import 'app/styles/cmdout.css';

import React from 'react';
import { Motion, spring } from 'react-motion';

import Layer from 'app/ui/Layer';
import CommandPalette from 'app/ui/CommandPalette';
import PlaylistCtrl from 'app/ui/PlaylistCtrl';
import PlayBtnCtrl from 'app/ui/PlayBtnCtrl';
import Profile from 'app/ui/Profile';
import CmdOut from 'app/ui/CmdOut';

import updateOnKey from 'app/fn/updateOnKey';
import { hasTag } from 'app/Tag';

class MainLayout extends React.Component {
  render() {
    var isCmdActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');

    return (
      <Layer>
        <Layer className='app-container' style={{ padding: '70px 0' }}>
          <Motion
            defaultStyle={{
              zoom: 100,
              y: 0,
              opacity: 100
            }}

            style={{
              zoom: spring(isCmdActivated ? 80 : 100),
              y: spring(isCmdActivated ? 200 : 0),
              opacity: spring(isCmdActivated ? 0 : 100)
            }}>
            {interpolated =>
              <div className='main-layout' style={{ transform: `scale(${interpolated.zoom / 100}) translate(0, ${interpolated.y}px)`, opacity: `${interpolated.opacity / 100}` }}>
                <PlaylistCtrl />
              </div>
            }
          </Motion>

          <div className='main-layout__play-btn'>
            <PlayBtnCtrl />
          </div>

          <div className='main-layout__profile'>
            <Profile />
          </div>
        </Layer>

        <Layer style={{ transform: `translate(0, ${isCmdActivated ? 0 : 100}%)` }}>
          <CmdOut />
        </Layer>

        <div className='app-cmd'>
          <CommandPalette />
        </div>
      </Layer>
    );
  }
}

export default updateOnKey(MainLayout, ':db/command-palette');
