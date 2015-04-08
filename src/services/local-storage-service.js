var Kefir = require('kefir');
var ISet = require('immutable').Set;
var db = require('app/core/db3');
var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var revive = require('app/core/revive');
var firstValue = require('app/utils/firstValue');
var addToSet = require('app/utils/addToSet');
var player = require('app/db/player');
var groups = require('app/db/groups');
var tracks = require('app/db/tracks');
var albums = require('app/db/albums');
var activity = db.scanEntity(ISet(), addToSet(':app/activity'));

module.exports = function (getStoredValue) {
  var out = Kefir.emitter();

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


  player
    .changes
    .map(player => player.track)
    .skipDuplicates()
    .map(JSON.stringify)
    .onValue(v => out.emit({ ':player/track': v }));

  Atom.listen(activity, function(activity) {
    out.emit({ ':app/activity': JSON.stringify({ activities: activity }) });
  });

  Atom.listen(groups, function(groups) {
    out.emit({ ':app/groups': JSON.stringify({ groups: groups }) });
  });

  Atom.listen(tracks, function(tracks) {
    out.emit({ ':app/tracks': JSON.stringify({ tracks: tracks }) });
  });

  Atom.listen(albums, function(albums) {
    out.emit({ ':app/albums': JSON.stringify({ albums: albums }) });
  });

  return out;
};
