var ISet = require('immutable').Set;
var app = require('app');
var vbus = require('app/core/vbus');
var GroupLoader = require('app/processes/groups-loader');
var TracksLoader = require('app/processes/tracks-loader');
var addTag = require('app/utils/addTag');
var tagOf = require('app/utils/tagOf');

module.exports = function (receive) {
  var user = vbus
    .filter(v => tagOf(v) === ':app/user')
    .filter(user => user.isAuthenticated());

  user.onValue(function (user) {
    var tout = app
      .go(new TracksLoader(user))
      .reduce(ISet(), (acc, v) => acc.union(v))
      .map(addTag(':app/tracks'));

    var gout = app
      .go(new GroupLoader(user))
      .reduce(ISet(), (acc, v) => acc.union(v))
      .map(addTag(':app/groups'));

    vbus.plug(tout);
    vbus.plug(gout);
  });

  user.toProperty().sample(2 * 60 * 1000).onValue(function (user) {
    var tout = app
      .go(new TracksLoader(user))
      .reduce(ISet(), (acc, v) => acc.union(v))
      .map(addTag(':app/tracks'));

    vbus.plug(tout);
  });

  user.toProperty().sample(10 * 60 * 1000).onValue(function (user) {
    var gout = app
      .go(new GroupLoader(user))
      .reduce(ISet(), (acc, v) => acc.union(v))
      .map(addTag(':app/groups'));

    vbus.plug(gout);
  });
};
