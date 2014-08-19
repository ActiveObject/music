var when = require('when');
var curry = require('curry');
var Vk = require('app/services/vk');
var VkApi = require('app/services/vk/vk-api');
var Router = require('app/core/router');

var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var Tracklist = require('app/components/tracklist');

var Promise = when.Promise;

function getAvailableGroups(appstate, next) {
  var user = appstate.get('user');

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

      resolve(appstate.set('groups', data.response.items));
    });
  }).then(next);
}

function getAvailableTracks(appstate, next) {
  var user = appstate.get('user');
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
      count: 8,
      v: '5.23  '
    }, function (err, data) {
      if (err) {
        return reject(err);
      }

      resolve(appstate.set('tracks', data.response.items));
    });
  }).then(next);
}

function setVisibleGroups(appstate, next) {
  return next(appstate.set('visibleGroups', appstate.get('groups').slice(0, 10).map(function (group) {
    return group.id;
  })));
}

function makeApp(appstate) {
  var main = new Main({
    key: 'main',
    activity: appstate.get('activity'),
    groups: appstate.get('groups'),
    visibleGroups: appstate.get('visibleGroups')
  });

  var tracklist = new Tracklist({
    tracks: appstate.get('tracks'),
    activeTrack: appstate.get('activeTrack'),
    name: 'Аудіозаписи'
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklist);

  return new App(null, [main, sidebar]);
}

module.exports = function mainRoute(appstate) {
  return getAvailableGroups(appstate, function (appstate) {
    return setVisibleGroups(appstate, function (appstate) {
      return getAvailableTracks(appstate, makeApp);
    });
  });
};