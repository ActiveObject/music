var Immutable = require('immutable');
var App = require('app/core/app');
var Auth = require('app/core/auth');
var routes = require('app/routes');

var when = require('when');
var Promise = when.Promise;
var Vk = require('app/services/vk');
var VkApi = require('app/services/vk/vk-api') ;
var accounts = require('app/accounts');

if (Auth.hasToken(location.hash)) {
  Auth.storeToLs(location.hash);
  location.hash = '';
}

var app = new App(Immutable.fromJS({
  activity: require('app/fixtures/activity'),

  activeTrack: {
    artist: 'Flux Pavilion',
    title: 'Got I to Know',
    duration: 350
  },

  groups: [],
  tracks: [],

  user: Auth.readFromLs()
}));

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

app.use(routes.auth);

app.cursor(function (appstate) {
  if (!appstate.contains('groups')) {
    when(getAvailableGroups(appstate.get('user').toJS()))
      .then(function (groups) {
        app.cursor(function (appstate, update) {
          update(appstate.set('groups', Immutable.fromJS(groups)));
        });
      });
  }
});

app.cursor(function (appstate) {
  if (!appstate.contains('tracks')) {
    when(getAvailableTracks(appstate.get('user').toJS()))
      .then(function (groups) {
        app.cursor(function (appstate, update) {
          update(appstate.set('tracks', Immutable.fromJS(groups)));
        });
      });
  }
});

app.on('/', routes.main);
app.on('/groups/:id', routes.group);

app.renderTo(document.getElementById('app'));
app.start();

window.Perf = require('react/addons').addons.Perf;

Perf.start();