var ISet = require('immutable').Set;
var Kefir = require('kefir');
var go = require('app/core/go');
var GroupsLoader = require('app/processes/groups-loader');
var TracksLoader = require('app/processes/tracks-loader');
var AlbumsLoader = require('app/processes/albums-loader');
var addTag = require('app/utils/addTag');
var tagOf = require('app/utils/tagOf');
var onValue = require('app/utils/onValue');

module.exports = function(vbus) {
  var user = vbus.filter(v => tagOf(v) === ':app/authenticated-user');

  var unsub1 = onValue(user, function (user) {
    var tout = go(new TracksLoader(user))
      .reduce((acc, v) => acc.union(v), ISet())
      .map(addTag(':app/tracks'));

    var gout = go(new GroupsLoader(user))
      .reduce((acc, v) => acc.union(v), ISet())
      .map(addTag(':app/groups'));

    var aout = go(new AlbumsLoader(user))
      .reduce((acc, v) => acc.union(v), ISet())
      .map(addTag(':app/albums'));

    vbus.plug(tout);
    vbus.plug(gout);
    vbus.plug(aout);
  });

  var unsub2 = onValue(user.toProperty().sampledBy(Kefir.interval(2 * 60 * 1000)), function (user) {
    var out = go(new TracksLoader(user))
      .reduce((acc, v) => acc.union(v), ISet())
      .map(addTag(':app/tracks'));

    vbus.plug(out);
  });

  var unsub3 = onValue(user.toProperty().sampledBy(Kefir.interval(10 * 60 * 1000)), function (user) {
    var out = go(new GroupsLoader(user))
      .reduce((acc, v) => acc.union(v), ISet())
      .map(addTag(':app/groups'));

    vbus.plug(out);
  });

  var unsub4 = onValue(user.toProperty().sampledBy(Kefir.interval(10 * 60 * 1000)), function (user) {
    var out = go(new AlbumsLoader(user))
      .reduce((acc, v) => acc.union(v), ISet())
      .map(addTag(':app/albums'));

    vbus.plug(out);
  });

  return function() {
    unsub1();
    unsub2();
    unsub3();
    unsub4();
  };
};

