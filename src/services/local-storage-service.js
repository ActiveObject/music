var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var revive = require('app/core/revive');
var tagOf = require('app/utils/tagOf');
var firstValue = require('app/utils/firstValue');
var PlayerStore = require('app/stores/player-store');
var ActivityStore = require('app/stores/activity-store');
var GroupStore = require('app/stores/group-store');
var TrackStore = require('app/stores/track-store');

if (localStorage.hasOwnProperty(':player/track')) {
  let track = firstValue(JSON.parse(localStorage.getItem(':player/track'), revive));
  vbus.push(PlayerStore.value.useTrack(track));
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

Atom.listen(ActivityStore, function(activity) {
  localStorage.setItem(':app/activity', JSON.stringify({ activities: activity }));
});

Atom.listen(GroupStore, function(groups) {
  localStorage.setItem(':app/groups', JSON.stringify({ groups: groups }));
});

Atom.listen(TrackStore, function(tracks) {
  localStorage.setItem(':app/tracks', JSON.stringify({ tracks: tracks }));
});
