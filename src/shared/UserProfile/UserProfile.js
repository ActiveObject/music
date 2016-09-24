import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user, opacity, rotationAngle, zoom }) =>
  <div className='UserProfile'>
    <span className='UserProfile__name' style={{ opacity: opacity }}>{`${user.firstName} ${user.lastName}`}</span>
    <img
      className='UserProfile__pic'
      src={user.photo50}
      style={{
        transform: `rotate(${rotationAngle}deg) scale(${zoom})`,
        opacity: opacity
      }} />
  </div>

export default UserProfile;
