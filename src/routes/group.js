var when = require('when');
var curry = require('curry');
var Vk = require('app/services/vk');
var VkApi = require('app/services/vk/vk-api');
var Router = require('app/core/router');

var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var ActiveTrack = require('app/components/active-track');
var AuthView = require('app/components/auth');
var accounts = require('app/accounts');
var GroupProfile = require('app/components/group-profile');

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

var authenticate = curry(function authenticate(appstate, next) {
  if (!Vk.isAuthenticated(appstate.get('user'))) {
    return new AuthView({
      url: Vk.makeAuthUrl(accounts.vk)
    });
  }

  return next(appstate);
});

var setVisibleGroups = curry(function setVisibleGroups(appstate, next) {
  return next(appstate.set('visibleGroups', appstate.get('groups').slice(0, 10).map(function (group) {
    return group.id;
  })))
});

var makeApp = curry(function makeApp(appstate) {
  var group = new GroupProfile({
    group: appstate.get('groups')[0]
  });

  var activeTrack = new ActiveTrack({
    track: appstate.get('activeTrack')
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, activeTrack);

  return new App(null, [group, sidebar]);
});

module.exports = function (appstate, ctx, next) {
  return authenticate(appstate, function (appstate) {
    return getAvailableGroups(appstate, function (appstate) {
      return setVisibleGroups(appstate, function (appstate) {
        return next(makeApp(appstate));
      });
    });
  });
};