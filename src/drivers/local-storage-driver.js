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
var tracks = require('app/db/tracks');
var albums = require('app/db/albums');
var Storage = require('app/Storage');
var merge = require('app/fn/merge');

module.exports = function (vbus) {
  var unsub1 = onValue(player
    .changes
    .map(player => player.track)
    .skipDuplicates()
    .filter(track => Object.keys(track.audio).length > 0)
    .map(JSON.stringify), v => Storage.setItem({ ':player/track': v }));

  var unsub4 = Atom.listen(tracks, function(tracks) {
    Storage.setItem({ ':app/tracks': JSON.stringify({ tracks: tracks }) });
  });

  var unsub5 = Atom.listen(albums, function(albums) {
    Storage.setItem({ ':app/albums': JSON.stringify({ albums: albums }) });
  });

  Storage.getItem(':player/track', function (track) {
    vbus.emit(merge(Atom.value(player), { track: JSON.parse(track) }));
  });

  Storage.getItem(':app/tracks', function (tracks) {
    vbus.emit([':app/tracks', JSON.parse(tracks, revive).tracks]);
  });

  Storage.getItem(':app/albums', function (albums) {
    vbus.emit([':app/albums', JSON.parse(albums, revive).albums]);
  });

  return function() {
    unsub1();
    unsub4();
    unsub5();
  };
};
