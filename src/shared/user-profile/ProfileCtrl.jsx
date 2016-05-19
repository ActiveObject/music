import React from 'react';
import app from 'app';
import { Motion, spring } from 'react-motion';
import { updateOn } from 'app/AppHost';
import { hasTag } from 'app/shared/Tag';
import Profile from './Profile';

const ProfileCtrl = () => {
  var user = app.value.get(':db/user');
  var isLoaded = hasTag(user, ':user/is-loaded');

  return (
    <Motion
      defaultStyle={{
        opacity: 0,
        rotate: 50,
        zoom: 80
      }}

      style={{
        opacity: spring(isLoaded ? 100 : 0, { stiffness: 160, damping: 50 }),
        rotate: spring(isLoaded ? 0 : 30, { stiffness: 150, damping: 30 }),
        zoom: spring(isLoaded ? 100 : 80)
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
