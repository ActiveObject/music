var Immutable = require('immutable');
var Bacon = require('baconjs');
var app = require('app');
var vbus = require('app/core/vbus');
var GroupLoader = require('app/processes/groups-loader');
var TracksLoader = require('app/processes/tracks-loader');
var addTag = require('app/utils/addTag');

module.exports = function (receive) {
  var trackIndexStream = Bacon.interval(2 * 60 * 1000);
  var groupIndexStream = Bacon.interval(10 * 60 * 1000);

  receive(':app/user', function (appstate, user) {
    if (user.isAuthenticated()) {
      var tout = app
        .go(new TracksLoader(user))
        .reduce(Immutable.Set(), (acc, v) => acc.union(v))
        .map(addTag(':app/tracks'));

      vbus.plug(tout);

      var gout = app
        .go(new GroupLoader(appstate.get('user')))
        .reduce(Immutable.Set(), (acc, v) => acc.union(v))
        .map(addTag(':app/groups'));

      vbus.plug(gout);
    }
  });

  vbus
    .filter(v => v.tag && v.tag() === ':app/user')
    .toProperty()
    .sampledBy(trackIndexStream)
    .onValue(function (user) {
      var tout = app
        .go(new TracksLoader(user))
        .reduce(Immutable.Set(), (acc, v) => acc.union(v))
        .map(addTag(':app/tracks'));

      vbus.plug(tout);
    });

  vbus
    .filter(v => v.tag && v.tag() === ':app/user')
    .toProperty()
    .sampledBy(groupIndexStream)
    .onValue(function (user) {
      var gout = app
        .go(new GroupLoader(appstate.get('user')))
        .reduce(Immutable.Set(), (acc, v) => acc.union(v))
        .map(addTag(':app/groups'));

      vbus.plug(gout);
    });
};
