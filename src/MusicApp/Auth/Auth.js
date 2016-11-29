import Url from 'url';
import querystring from 'querystring';
import React, { Component, PropTypes } from 'react';
import Icon from '../Icon';
import './Auth.css';
import vkLogo from './vkcom.svg';

class Auth extends Component {
  static propTypes = {
    appId: PropTypes.string.isRequired,
    apiVersion: PropTypes.string.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    onAuth: PropTypes.func.isRequired
  }

  componentDidMount() {
    if (hasToken(location.hash)) {
      var credentials = querystring.parse(location.hash.slice(1));

      localStorage.setItem('user_id', credentials.user_id);
      localStorage.setItem('access_token', credentials.access_token);

      this.props.onAuth(credentials.user_id, credentials.access_token);

      location.hash = '#';
    }

    if (isUserInStorage()) {
      return this.props.onAuth(localStorage.getItem('user_id'), localStorage.getItem('access_token'));
    }
  }

  render() {
    if (this.props.isAuthenticated) {
      return this.props.children;
    }

    const AUTH_URL = Url.format({
      protocol: 'https',
      host: 'oauth.vk.com',
      pathname: '/authorize',
      query: {
        client_id: this.props.appId,
        scope: ['audio', 'groups', 'wall', 'offline'].join(','),
        redirect_uri: window.location.origin,
        display: 'popup',
        v: this.props.apiVersion,
        response_type: 'token'
      }
    });

    return (
      <div className='auth'>
        <a className='element-link auth-link' href={AUTH_URL}>
          <div className='auth-bg-circle'>
            <Icon id={vkLogo} className='auth-vk-icon' />
            <div className='auth-vk-desc'>{'login with vk'}</div>
          </div>
        </a>
      </div>
    );
  }
}

function hasToken(hash) {
  return hash && querystring.parse(hash.slice(1)).access_token;
}

function isUserInStorage() {
  return localStorage.getItem('user_id') && localStorage.getItem('access_token');
}

export default Auth;
