var Url = require('url');

exports.API_BASE = 'https://api.vk.com/method';
exports.AUTH_URL = 'https://oauth.vk.com/authorize';
exports.REDIRECT_URI = window.location.origin;
exports.API_VERSION = '5.23';
exports.APP_ID = process.env.MUSIC_APP_ID;
exports.PERMISSIONS = ['friends', 'audio', 'groups', 'wall', 'offline', 'newsfeed'];
exports.DISPLAY = 'popup';

exports.url = Url.format({
  host: Url.parse(exports.AUTH_URL).host,
  pathname: Url.parse(exports.AUTH_URL).pathname,
  query: {
    client_id: exports.APP_ID,
    scope: exports.PERMISSIONS.join(','),
    redirect_uri: exports.REDIRECT_URI,
    display: exports.DISPLAY,
    v: exports.API_VERSION,
    response_type: 'token'
  }
});
