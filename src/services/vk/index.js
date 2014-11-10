var _ = require('underscore');
var Url = require('url');
var User = require('app/values/user');
var VkApi = require('./vk-api') ;

function Vk(receive, send) {
  return function (appstate, type, data) {
    if (!Vk.isAuthenticated(appstate.get('user'))) {
      return appstate;
    }

    if (!appstate.has('vk')) {
      var vk = new VkApi({
        auth: {
          type: 'oauth',
          user: appstate.get('user').id,
          token: appstate.get('user').accessToken
        },

        rateLimit: 1
      });

      send('vk:ready', vk);

      return appstate.set('vk', vk);
    }

    return appstate;
  };
}

Vk.isAuthenticated = function isAuthenticated(user) {
  return user instanceof User.Authenticated;
};

Vk.makeAuthUrl = function makeAuthUrl(config) {
  return Url.format({
    host: Url.parse(config.AUTH_URL).host,
    pathname: Url.parse(config.AUTH_URL).pathname,
    query: {
      client_id: config.APP_ID,
      scope: config.PERMISSIONS.join(','),
      redirect_uri: config.REDIRECT_URI,
      display: config.DISPLAY,
      v: config.API_VERSION,
      response_type: 'token'
    }
  });
};

module.exports = Vk;