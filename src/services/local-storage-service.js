var Kefir = require('kefir');
var ISet = require('immutable').Set;
var db = require('app/db');
var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var revive = require('app/core/revive');
var firstValue = require('app/fn/firstValue');
var addToSet = require('app/fn/addToSet');
var onValue = require('app/fn/onValue');
var player = require('app/db/player');
var groups = require('app/db/groups');
var tracks = require('app/db/tracks');
var albums = require('app/db/albums');
var activity = new Atom(ISet());

db
  .map(v => v.get(':db/activity'))
  .filter(Boolean)
  .skipDuplicates()
  .onValue(v => Atom.swap(activity, v));

var Storage = require('app/Storage');
var merge = require('app/fn/merge');

module.exports = function (vbus) {
  var unsub1 = onValue(player
    .changes
    .map(player => player.track)
    .skipDuplicates()
    .filter(track => Object.keys(track.audio).length > 0)
    .map(JSON.stringify), v => Storage.setItem({ ':player/track': v }));

  var unsub2 = Atom.listen(activity, function(activity) {
    Storage.setItem({ ':app/activity': JSON.stringify({ activities: activity }) });
  });

  var unsub3 = Atom.listen(groups, function(groups) {
    Storage.setItem({ ':app/groups': JSON.stringify({ groups: groups }) });
  });

  var unsub4 = Atom.listen(tracks, function(tracks) {
    Storage.setItem({ ':app/tracks': JSON.stringify({ tracks: tracks }) });
  });

  var unsub5 = Atom.listen(albums, function(albums) {
    Storage.setItem({ ':app/albums': JSON.stringify({ albums: albums }) });
  });

  Storage.getItem(':player/track', function (track) {
    vbus.emit(merge(Atom.value(player), { track: firstValue(JSON.parse(track, revive)) }));
  });

  Storage.getItem(':app/activity', function (activity) {
    vbus.emit([':app/activity', JSON.parse(activity, revive).activities]);
  });

  Storage.getItem(':app/tracks', function (tracks) {
    vbus.emit([':app/tracks', JSON.parse(tracks, revive).tracks]);
  });

  Storage.getItem(':app/groups', function (groups) {
    vbus.emit([':app/groups', JSON.parse(groups, revive).groups]);
  });

  Storage.getItem(':app/albums', function (albums) {
    vbus.emit([':app/albums', JSON.parse(albums, revive).albums]);
  });

  return function() {
    unsub1();
    unsub2();
    unsub3();
    unsub4();
    unsub5();
  };
};
