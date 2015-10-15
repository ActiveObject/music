import React from 'react';
import db from 'app/db';
import { Motion, spring } from 'react-motion';

import updateOnKey from 'app/fn/updateOnKey';
import { hasTag } from 'app/Tag';

var Profile = React.createClass({
  render: function () {
    var user = db.value.get(':db/user');
    var isLoaded = hasTag(user, ':user/is-loaded');

    return (
      <Motion
        defaultStyle={{
          opacity: 0,
          rotate: 30,
          zoom: 80
        }}

        style={{
          opacity: spring(isLoaded ? 100 : 0, [160, 50]),
          rotate: spring(isLoaded ? 0 : 30, [150, 30]),
          zoom: spring(isLoaded ? 100 : 80)
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

export default updateOnKey(Profile, ':db/user');