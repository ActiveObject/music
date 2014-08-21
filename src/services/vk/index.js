var Url = require('url');
var Immutable = require('immutable');
var Promise = require('when').Promise;
var app = require('app/core/app');
var accounts = require('app/accounts');
var VkApi = require('./vk-api') ;

function getAvailableGroups(user) {
  var vk = new VkApi({
    auth: {
      type: 'oauth',
      user: user.accounts.vk.user_id,
      token: user.accounts.vk.access_token
    },

    rateLimit: 2
  });

  return new Promise(function (resolve, reject) {
    vk.groups.get({
      user_id: user.accounts.vk.user_id,
      extended: 1,
      v: '5.23  '
    }, function (err, data) {
      if (err) {
        return reject(err);
      }

      resolve(data.response.items);
    });
  });
}

function getAvailableTracks(user) {
  var vk = new VkApi({
    auth: {
      type: 'oauth',
      user: user.accounts.vk.user_id,
      token: user.accounts.vk.access_token
    },

    rateLimit: 2
  });

  return new Promise(function (resolve, reject) {
    vk.audio.get({
      owner_id: user.accounts.vk.user_id,
      offset: 0,
      count: 1000,
      v: '5.23  '
    }, function (err, data) {
      if (err) {
        return reject(err);
      }

      resolve(data.response.items);
    });
  });
}

function Vk(appstate, type, data) {
  if (type === 'groups:load') {
    return appstate.set('groups', Immutable.fromJS(data.groups));
  }

  if (type === 'tracks:load') {
    return appstate.set('tracks', Immutable.fromJS(data.tracks));
  }

  if (type === 'app:start') {
    getAvailableGroups(appstate.get('user').toJS()).then(function (groups) {
      app.dispatch('groups:load', {
        groups: groups
      });
    });

    getAvailableTracks(appstate.get('user').toJS()).then(function (tracks) {
      app.dispatch('tracks:load', {
        tracks: tracks
      });
    });

    return appstate;
  }

  return appstate;
}

Vk.isAuthenticated = function isAuthenticated(user) {
  return user && user.accounts && user.accounts.vk && user.accounts.vk.access_token;
};

Vk.makeAuthUrl = function makeAuthUrl(config) {
  return Url.format({
    host: Url.parse(config.AUTH_URL).host,
    pathname: Url.parse(config.AUTH_URL).pathname,
    query: {
      client_id: config.APP_ID,
      scope: config.PERMISSIONS,
      redirect_uri: config.REDIRECT_URI,
      display: config.DISPLAY,
      v: config.API_VERSION,
      response_type: 'token'
    }
  });
};

module.exports = Vk;