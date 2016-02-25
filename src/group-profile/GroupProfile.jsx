import React from 'react';
import vk from 'app/vk';
import './GroupProfile.css';

let GroupProfile = ({ group }) => (
  <div className='group-profile'>
    <div className='group-image'>
      <img src={group.photo_200} />
    </div>
    <span className='group-name'>{group.name}</span>
  </div>
);

export default GroupProfile;
