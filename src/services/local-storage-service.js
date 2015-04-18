var Kefir = require('kefir');
var ISet = require('immutable').Set;
var db = require('app/core/db3');
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
var activity = db.scanEntity(ISet(), addToSet(':app/activity'));

module.exports = function (setValueToStore) {
  var unsub1 = onValue(player
    .changes
    .map(player => player.track)
    .skipDuplicates()
    .map(JSON.stringify), v => setValueToStore({ ':player/track': v }));

  var unsub2 = Atom.listen(activity, function(activity) {
    setValueToStore({ ':app/activity': JSON.stringify({ activities: activity }) });
  });

  var unsub3 = Atom.listen(groups, function(groups) {
    setValueToStore({ ':app/groups': JSON.stringify({ groups: groups }) });
  });

  var unsub4 = Atom.listen(tracks, function(tracks) {
    setValueToStore({ ':app/tracks': JSON.stringify({ tracks: tracks }) });
  });

  var unsub5 = Atom.listen(albums, function(albums) {
    setValueToStore({ ':app/albums': JSON.stringify({ albums: albums }) });
  });

  return function() {
    unsub1();
    unsub2();
    unsub3();
    unsub4();
    unsub5();
  };
};

module.exports.read = function(getStoredValue) {
  getStoredValue(':player/track', function (track) {
    vbus.emit(Atom.value(player).useTrack(firstValue(JSON.parse(track, revive))));
  });

  getStoredValue(':app/activity', function (activity) {
    vbus.emit([':app/activity', JSON.parse(activity, revive).activities]);
  });

  getStoredValue(':app/tracks', function (tracks) {
    vbus.emit([':app/tracks', JSON.parse(tracks, revive).tracks]);
  });

  getStoredValue(':app/groups', function (groups) {
    vbus.emit([':app/groups', JSON.parse(groups, revive).groups]);
  });

  getStoredValue(':app/albums', function (albums) {
    vbus.emit([':app/albums', JSON.parse(albums, revive).albums]);
  });
};
