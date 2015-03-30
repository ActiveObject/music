var has = require('underscore').has;
var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var revive = require('app/core/revive');
var tagOf = require('app/utils/tagOf');
var firstValue = require('app/utils/firstValue');

function getStoredValue(key, fn) {
  chrome.storage.local.get(key, function (items) {
    if (has(items, key)) {
      fn(items[key]);
    }
  });
}

getStoredValue(':player/track', function (track) {
  vbus.push(Atom.value(PlayerStore).useTrack(firstValue(JSON.parse(track, revive))));
});

getStoredValue(':app/activity', function (activity) {
  vbus.push([':app/activity', JSON.parse(activity, revive).activities]);
});

getStoredValue(':app/tracks', function (tracks) {
  vbus.push([':app/tracks', JSON.parse(tracks, revive).tracks]);
});

getStoredValue(':app/groups', function (groups) {
  vbus.push([':app/groups', JSON.parse(groups, revive).groups]);
});


vbus
  .filter(v => tagOf(v) === ':app/player')
  .map(player => player.track)
  .skipDuplicates()
  .map(JSON.stringify)
  .onValue(function(v) {
    chrome.storage.local.set({ ':player/track': v }, function () {

    });
  });

Atom.listen(ActivityStore, function(activity) {
  chrome.storage.local.set({
    ':app/activity': JSON.stringify({ activities: activity })
  }, function () {

  });
});

Atom.listen(GroupStore, function(groups) {
  chrome.storage.local.set({
    ':app/groups': JSON.stringify({ groups: groups })
  }, function () {

  });
});

Atom.listen(TrackStore, function(tracks) {
  chrome.storage.local.set({
    ':app/tracks': JSON.stringify({ tracks: tracks })
  }, function () {

  });
});
