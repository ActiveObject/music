import React from 'react';
import './GroupProfile.css';

var GroupImage = ({ group }) => (
  <div className='group-image'>
    <img src={group.photo_200} />
  </div>
);

var GroupProfile = ({ group }) => (
  <div className='group-profile'>
    <GroupImage group={group} />
    <span className='group-name'>{group.name}</span>
  </div>
);

export default GroupProfile;
