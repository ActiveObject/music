import React from 'react';
import db from 'app/db';
import { Spring } from 'react-motion';

import updateOnKey from 'app/fn/updateOnKey';
import hasTag from 'app/fn/hasTag';

var Profile = React.createClass({
  render: function () {
    var user = db.value.get(':db/user');
    var isLoaded = hasTag(user, ':user/is-loaded');

    return (
      <Spring
        defaultValue={{
          opacity: { val: 0 },
          rotate: { val: 30 },
          zoom: { val: 80 }
        }}

        endValue={{
          opacity: { val: isLoaded ? 100 : 0, config: [160, 50] },
          rotate: { val: isLoaded ? 0 : 30, config: [150, 30] },
          zoom: { val: isLoaded ? 100 : 80 }
        }}>
        {interpolated =>
          <div className='profile'>
            <span className='profile__name' style={{ opacity: interpolated.opacity.val / 100 }}>{`${user.firstName} ${user.lastName}`}</span>
            <img
              className='profile__pic'
              src={user.photo50}
              style={{
                transform: `rotate(${interpolated.rotate.val}deg) scale(${interpolated.zoom.val / 100})`,
                opacity: interpolated.opacity.val / 100
              }} />
          </div>
        }
      </Spring>
    );
  }
});

export default updateOnKey(Profile, ':db/user');