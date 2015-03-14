var Immutable = require('immutable');
var Bacon = require('baconjs');
var app = require('app');
var GroupLoader = require('app/processes/groups-loader');
var TracksLoader = require('app/processes/tracks-loader');
var vbus = require('app/core/vbus');

module.exports = function (receive) {
  var unplugTrackIndexing = function () {};
  var unplugGroupIndexing = function () {};

  var trackIndexStream = Bacon.interval(2 * 60 * 1000, {
    e: 'vk',
    a: ':vk/index-tracks',
    v: true
  });

  var groupIndexStream = Bacon.interval(10 * 60 * 1000, {
    e: 'vk',
    a: ':vk/index-groups',
    v: true
  });

  receive(':app/user', function (appstate, user) {
    if (user.isAuthenticated()) {
      unplugTrackIndexing = vbus.plug(trackIndexStream);
      unplugGroupIndexing = vbus.plug(groupIndexStream);
      vbus.push({ e: 'vk', a: ':vk/index-tracks', v: true });
      vbus.push({ e: 'vk', a: ':vk/index-groups', v: true });
    } else {
      unplugTrackIndexing();
      unplugGroupIndexing();
    }

    return appstate;
  });

  receive(':vk/index-tracks', function (appstate) {
    var tout = app
      .go(new TracksLoader(appstate.get('user')))
      .reduce(Immutable.Set(), (acc, v) => acc.union(v));

    vbus.plug(tout.map(v => ({ e: 'app', a: ':app/tracks', v: v })));
  });

  receive(':vk/index-groups', function (appstate) {
    var gout = app
      .go(new GroupLoader(appstate.get('user')))
      .reduce(Immutable.Set(), (acc, v) => acc.union(v));

    vbus.plug(gout.map(v => ({ e: 'app', a: ':app/groups', v: v })));
  });
};
