import React from 'react';
import Icon from 'app/shared/Icon';

import './auth.css';
import vkLogo from './vkcom.svg';

function AuthView({ url }) {
  return (
    <div className='auth'>
      <a className='element-link auth-link' href={url}>
        <div className='auth-bg-circle'>
          <Icon id={vkLogo} className='auth-vk-icon' />
          <div className='auth-vk-desc'>{'login with vk'}</div>
        </div>
      </a>
    </div>
  );
}

export default AuthView;
