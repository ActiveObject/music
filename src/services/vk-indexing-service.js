var Immutable = require('immutable');
var Bacon = require('baconjs');
var app = require('app');
var Atom = require('app/core/atom');
var ActivityLoader = require('app/processes/activity-loader');
var GroupLoader = require('app/processes/groups-loader');
var TracksLoader = require('app/processes/tracks-loader');
var eventBus = require('app/core/event-bus');

module.exports = function (receive) {
  receive(':app/started', function () {
    eventBus.plug(Bacon.interval(2 * 60 * 1000, {
      e: 'vk',
      a: ':vk/index-tracks',
      v: true
    }));

    eventBus.plug(Bacon.interval(10 * 60 * 1000, {
      e: 'vk',
      a: ':vk/index-groups',
      v: true
    }));

    eventBus.push({ e: 'vk', a: ':vk/index-tracks', v: true });
    eventBus.push({ e: 'vk', a: ':vk/index-groups', v: true });
  });

  receive(':vk/index-tracks', function (appstate) {
    var tout = app
      .go(new TracksLoader(appstate.get('user')))
      .reduce(Immutable.Set(), (acc, v) => acc.union(v));

    eventBus.plug(tout.map(v => ({ e: 'app', a: ':app/tracks', v: v })));
  });

  receive(':vk/index-groups', function (appstate) {
    var gout = app
      .go(new GroupLoader(appstate.get('user')))
      .reduce(Immutable.Set(), (acc, v) => acc.union(v));

    eventBus.plug(gout.map(v => ({ e: 'app', a: ':app/groups', v: v })));
  });
};
