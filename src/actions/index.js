var app = require('app/core/app');
var Immutable = require('immutable');
var Promise = require('when').Promise;
var Vk = require('app/services/vk');
var VkApi = require('app/services/vk/vk-api') ;
var accounts = require('app/accounts');

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


exports.loadGroups = function loadGroups(appstate, type, data) {
  if (type === 'groups:load') {
    return appstate.set('groups', Immutable.fromJS(data.groups));
  }

  if (type === 'app:start') {
    getAvailableGroups(appstate.get('user').toJS()).then(function (groups) {
      app.dispatch('groups:load', {
        groups: groups
      });
    });

    return appstate;
  }

  return appstate;
};

exports.loadTracks = function loadTracks(appstate, type, data) {
  if (type === 'tracks:load') {
    return appstate.set('tracks', Immutable.fromJS(data.tracks));
  }

  if (type === 'app:start') {
    getAvailableTracks(appstate.get('user').toJS()).then(function (tracks) {
      app.dispatch('tracks:load', {
        tracks: tracks
      });
    });

    return appstate;
  }

  return appstate;
};

exports.updateActiveTrack = function updateActiveTrack(appstate, type, data) {
  if (type === 'toggle:play') {
    var activeTrack = appstate.get('activeTrack');

    if (data.track.get('id') !== activeTrack.get('id')) {
      return appstate.set('activeTrack', data.track.set('isPlaying', true));
    }

    return appstate.set('activeTrack', activeTrack.set('isPlaying', !activeTrack.get('isPlaying')));
  }

  return appstate;
};