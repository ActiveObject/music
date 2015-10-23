import React from 'react';
import Icon from 'app/ui/icon';

import './auth.css';

function AuthView({ url }) {
  return (
    <div className='auth'>
      <a className='element-link auth-link' href={url}>
        <div className='auth-bg-circle'>
          <Icon id='shape-vkcom' className='auth-vk-icon' />
          <div className='auth-vk-desc'>{'login with vk'}</div>
        </div>
      </a>
    </div>
  );
}

export default AuthView;