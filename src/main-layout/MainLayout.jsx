import React from 'react';
import { Motion, spring } from 'react-motion';
import app from 'app';
import { updateOn } from 'app/renderer';
import { hasTag } from 'app/Tag';

import CommandPalette from 'app/command-palette/CommandPalette';
import PlaylistCtrl from './PlaylistCtrl';
import Layer from './Layer';
import PlayBtnCtrl from './PlayBtnCtrl';
import ProfileCtrl from './ProfileCtrl';
import CmdOut from './CmdOut';

const MainLayout = () => {
  var isCmdActivated = hasTag(app.value.get(':db/command-palette'), ':cmd/is-activated');

  return (
    <Layer>
      <Layer className='app-container' style={{ padding: '70px 0' }}>
        <PlaylistCtrl />
        <PlayBtnCtrl />
        <ProfileCtrl />
      </Layer>

      <Layer style={{ transform: `translate(0, ${isCmdActivated ? 0 : 100}%)` }}>
        <CmdOut />
      </Layer>

      <Motion
        defaultStyle={{ fontSize: 2, y: 0 }}
        style={{ fontSize: spring(isCmdActivated ? 3 : 2), y: spring(isCmdActivated ? 100 : 0) }}>
        {interpolated =>
          <div
            className='app-cmd'
            style={{
              transform: `translate(0, ${interpolated.y}px)`,
              fontSize: `${interpolated.fontSize}rem`
            }}>
            <CommandPalette />
          </div>
        }
      </Motion>
    </Layer>
  );
}

export default updateOn(MainLayout, ':db/command-palette');
