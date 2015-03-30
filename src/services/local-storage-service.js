var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var revive = require('app/core/revive');
var db = require('app/core/db');
var tagOf = require('app/utils/tagOf');
var firstValue = require('app/utils/firstValue');
var player = require('app/player');
var groups = require('app/groups');
var tracks = require('app/tracks');
var activity = require('app/activity');

db.install(activity, function (acc, v) {
  if (tagOf(v) === ':app/activity') {
    return acc.union(v[1]);
  }

  return acc;
});

if (localStorage.hasOwnProperty(':player/track')) {
  let track = firstValue(JSON.parse(localStorage.getItem(':player/track'), revive));
  vbus.push(Atom.value(player).useTrack(track));
}

if (localStorage.hasOwnProperty(':app/activity')) {
  vbus.push([':app/activity', JSON.parse(localStorage.getItem(':app/activity'), revive).activities]);
}

if (localStorage.hasOwnProperty(':app/tracks')) {
  vbus.push([':app/tracks', JSON.parse(localStorage.getItem(':app/tracks'), revive).tracks]);
}

if (localStorage.hasOwnProperty(':app/groups')) {
  vbus.push([':app/groups', JSON.parse(localStorage.getItem(':app/groups'), revive).groups]);
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
