import React from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import { hasTag } from 'app/shared/Tag';
import UserProfile from './UserProfile';

const UserProfileCtrl = ({ user }) => {
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 30px'}}>
          <UserProfile user={user} opacity={interpolated.opacity / 100} rotationAngle={interpolated.rotate} zoom={interpolated.zoom / 100} />
        </div>
      }
    </Motion>
  );
}

export default connect(state => ({ user: state.user }))(UserProfileCtrl);
