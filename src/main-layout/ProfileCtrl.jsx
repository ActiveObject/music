import React from 'react';
import app from 'app';
import { Motion, spring } from 'react-motion';
import { updateOn } from 'app/renderer';
import { hasTag } from 'app/Tag';
import Profile from './Profile';

const ProfileCtrl = () => {
  var user = app.value.get(':db/user');
  var isLoaded = hasTag(user, ':user/is-loaded');
  var isCmdActivated = hasTag(app.value.get(':db/command-palette'), ':cmd/is-activated');

  return (
    <Motion
      defaultStyle={{
        opacity: 0,
        rotate: 50,
        zoom: 80
      }}

      style={{
        opacity: isCmdActivated ? spring(0) : spring(isLoaded ? 100 : 0, [160, 50]),
        rotate: isCmdActivated ? spring(30) : spring(isLoaded ? 0 : 30, [150, 30]),
        zoom: isCmdActivated ? spring(80) : spring(isLoaded ? 100 : 80)
      }}>
      {interpolated =>
        <div className='main-layout__profile'>
          <Profile user={user} opacity={interpolated.opacity / 100} rotationAngle={interpolated.rotate} zoom={interpolated.zoom / 100} />
        </div>
      }
    </Motion>
  );
}

export default updateOn(ProfileCtrl, [':db/user', ':db/command-palette']);
