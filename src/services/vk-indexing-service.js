var ISet = require('immutable').Set;
var go = require('app/core/go');
var vbus = require('app/core/vbus');
var GroupLoader = require('app/processes/groups-loader');
var TracksLoader = require('app/processes/tracks-loader');
var addTag = require('app/utils/addTag');
var tagOf = require('app/utils/tagOf');

var user = vbus.filter(v => tagOf(v) === ':app/authenticated-user');

user.onValue(function (user) {
  var tout = go(new TracksLoader(user))
    .reduce(ISet(), (acc, v) => acc.union(v))
    .map(addTag(':app/tracks'));

  var gout = go(new GroupLoader(user))
    .reduce(ISet(), (acc, v) => acc.union(v))
    .map(addTag(':app/groups'));

  vbus.plug(tout);
  vbus.plug(gout);
});

user.toProperty().sample(2 * 60 * 1000).onValue(function (user) {
  var tout = go(new TracksLoader(user))
    .reduce(ISet(), (acc, v) => acc.union(v))
    .map(addTag(':app/tracks'));

  vbus.plug(tout);
});

user.toProperty().sample(10 * 60 * 1000).onValue(function (user) {
  var gout = go(new GroupLoader(user))
    .reduce(ISet(), (acc, v) => acc.union(v))
    .map(addTag(':app/groups'));

  vbus.plug(gout);
});
