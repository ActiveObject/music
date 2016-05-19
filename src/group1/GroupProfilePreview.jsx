import React from 'react';
import './GroupProfile.css';

let GroupProfilePreview = ({ isActive, children }) => {
  if (!isActive) {
    return children;
  }

  return (
    <div className='group-profile group-profile-preview'>
      <div className='group-image'>
        <div className='group-profile-preview__image' />
      </div>
      <span className='group-name'>
        <div className='group-profile-preview__name' />
      </span>
    </div>
  );
}

export default GroupProfilePreview;
