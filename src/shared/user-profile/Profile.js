import React from 'react';


import './Profile.css';

const Profile = ({ user, opacity, rotationAngle, zoom }) =>
  <div className='profile'>
    <span className='profile__name' style={{ opacity: opacity }}>{`${user.firstName} ${user.lastName}`}</span>
    <img
      className='profile__pic'
      src={user.photo50}
      style={{
        transform: `rotate(${rotationAngle}deg) scale(${zoom})`,
        opacity: opacity
      }} />
  </div>

export default Profile;
