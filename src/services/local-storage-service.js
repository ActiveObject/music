var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var revive = require('app/core/revive');
var db = require('app/core/db');
var tagOf = require('app/utils/tagOf');
var firstValue = require('app/utils/firstValue');
var player = require('app/db/player');
var groups = require('app/db/groups');
var tracks = require('app/db/tracks');
var albums = require('app/db/albums');
var activity = require('app/db/activity');

if (localStorage.hasOwnProperty(':player/track')) {
  let track = firstValue(JSON.parse(localStorage.getItem(':player/track'), revive));
  vbus.emit(Atom.value(player).useTrack(track));
}

if (localStorage.hasOwnProperty(':app/activity')) {
  vbus.emit([':app/activity', JSON.parse(localStorage.getItem(':app/activity'), revive).activities]);
}

if (localStorage.hasOwnProperty(':app/tracks')) {
  vbus.emit([':app/tracks', JSON.parse(localStorage.getItem(':app/tracks'), revive).tracks]);
}

if (localStorage.hasOwnProperty(':app/groups')) {
  vbus.emit([':app/groups', JSON.parse(localStorage.getItem(':app/groups'), revive).groups]);
}

if (localStorage.hasOwnProperty(':app/albums')) {
  vbus.emit([':app/albums', JSON.parse(localStorage.getItem(':app/albums'), revive).albums]);
}

vbus
  .filter(v => tagOf(v) === ':app/player')
  .map(player => player.track)
  .skipDuplicates()
  .map(JSON.stringify)
  .onValue(v => localStorage.setItem(':player/track', v));

Atom.listen(activity, function(activity) {
  localStorage.setItem(':app/activity', JSON.stringify({ activities: activity }));
});

Atom.listen(groups, function(groups) {
  localStorage.setItem(':app/groups', JSON.stringify({ groups: groups }));
});

Atom.listen(tracks, function(tracks) {
  localStorage.setItem(':app/tracks', JSON.stringify({ tracks: tracks }));
});

Atom.listen(albums, function(albums) {
  localStorage.setItem(':app/albums', JSON.stringify({ albums: albums }));
});
