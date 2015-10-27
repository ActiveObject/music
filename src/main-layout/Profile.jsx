import React from 'react';
import db from 'app/db';
import { Motion, spring } from 'react-motion';

import updateOn from 'app/updateOn';
import { hasTag } from 'app/Tag';

import './profile.css';

var Profile = React.createClass({
  render: function () {
    var user = db.value.get(':db/user');
    var isLoaded = hasTag(user, ':user/is-loaded');
    var isCmdActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');

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
          <div className='profile'>
            <span className='profile__name' style={{ opacity: interpolated.opacity / 100 }}>{`${user.firstName} ${user.lastName}`}</span>
            <img
              className='profile__pic'
              src={user.photo50}
              style={{
                transform: `rotate(${interpolated.rotate}deg) scale(${interpolated.zoom / 100})`,
                opacity: interpolated.opacity / 100
              }} />
          </div>
        }
      </Motion>
    );
  }
});

export default updateOn(Profile, [':db/user', ':db/command-palette']);