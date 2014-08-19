var when = require('when');
var curry = require('curry');
var _ = require('underscore');
var Vk = require('app/services/vk');
var VkApi = require('app/services/vk/vk-api');
var Router = require('app/core/router');

var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var ActiveTrack = require('app/components/active-track');
var GroupProfile = require('app/components/group-profile');
var Tracklist = require('app/components/tracklist');

var Promise = when.Promise;

var getAvailableGroups = curry(function getAvailableGroups(appstate, next) {
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
  }).then(next)
});

var getAvailableTracks = curry(function getAvailableTracks(appstate, next) {
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
      count: 20,
      v: '5.23  '
    }, function (err, data) {
      if (err) {
        return reject(err);
      }

      resolve(appstate.set('tracks', data.response.items));
    });
  }).then(next)
});

var makeApp = curry(function makeApp(groupId, appstate) {
  var group = new GroupProfile({
    group: _.find(appstate.get('groups'), function (group) {
      return group.id === groupId;
    })
  });

  var activeTrack = new ActiveTrack({
    track: appstate.get('activeTrack')
  });

  var tracklist = new Tracklist({
    key: 'tracklist',
    tracks: appstate.get('tracks'),
    name: 'Аудіозаписи'
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, [activeTrack, tracklist]);

  return new App(null, [group, sidebar]);
});

module.exports = function groupRoute(appstate, ctx) {
  var id = parseInt(ctx.params.id, 10);

  return getAvailableGroups(appstate, function (appstate) {
    return getAvailableTracks(appstate, function (appstate) {
      return makeApp(id, appstate);
    });
  });
};