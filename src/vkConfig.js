import Url from 'url';

var API_BASE = 'https://api.vk.com/method';
var AUTH_URL = 'https://oauth.vk.com/authorize';
var REDIRECT_URI = window.location.origin;
var API_VERSION = '5.29';
var APP_ID = process.env.MUSIC_APP_ID;
var PERMISSIONS = ['audio', 'groups', 'wall', 'offline'];
var DISPLAY = 'popup';

export var url = Url.format({
  host: Url.parse(AUTH_URL).host,
  pathname: Url.parse(AUTH_URL).pathname,
  query: {
    client_id: APP_ID,
    scope: PERMISSIONS.join(','),
    redirect_uri: REDIRECT_URI,
    display: DISPLAY,
    v: API_VERSION,
    response_type: 'token'
  }
});
