import Url from 'url';
import querystring from 'querystring';
import React from 'react';
import app from 'app';
import AuthView from 'app/auth/AuthView';
import { hasTag } from 'app/Tag';
import { updateOn } from 'app/StartApp';

const AUTH_URL = Url.format({
  protocol: 'https',
  host: 'oauth.vk.com',
  pathname: '/authorize',
  query: {
    client_id: process.env.MUSIC_APP_ID,
    scope: ['audio', 'groups', 'wall', 'offline'].join(','),
    redirect_uri: window.location.origin,
    display: 'popup',
    v: '5.29',
    response_type: 'token'
  }
});


function hasToken(hash) {
  return hash && querystring.parse(hash.slice(1)).access_token;
}

function isUserInStorage() {
  return localStorage.getItem('user_id') && localStorage.getItem('access_token');
}

class Authenticated extends React.Component {
  componentDidMount() {
    if (hasToken(location.hash)) {
      var credentials = querystring.parse(location.hash.slice(1));

      localStorage.setItem('user_id', credentials.user_id);
      localStorage.setItem('access_token', credentials.access_token);

      app.push({
        tag: [':app/user', ':user/authenticated'],
        id: credentials.user_id,
        accessToken: credentials.access_token
      });

      location.hash = '#';
    }

    if (isUserInStorage()) {
      return app.push({
        tag: [':app/user', ':user/authenticated'],
        id: localStorage.getItem('user_id'),
        accessToken: localStorage.getItem('access_token')
      });
    }
  }

  render() {
    if (!hasTag(app.value.get(':db/user'), ':user/authenticated')) {
      return <AuthView url={AUTH_URL} />
    }

    return this.props.children;
  }
}

export default updateOn(Authenticated, [':db/user']);
