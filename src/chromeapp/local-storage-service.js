var has = require('underscore').has;
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


function getStoredValue(key, fn) {
  chrome.storage.local.get(key, function (items) {
    if (has(items, key)) {
      fn(items[key]);
    }
  });
}

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


vbus
  .filter(v => tagOf(v) === ':app/player')
  .map(player => player.track)
  .skipDuplicates()
  .map(JSON.stringify)
  .onValue(function(v) {
    chrome.storage.local.set({ ':player/track': v }, function () {

    });
  });

Atom.listen(activity, function(activity) {
  chrome.storage.local.set({
    ':app/activity': JSON.stringify({ activities: activity })
  }, function () {

  });
});

Atom.listen(groups, function(groups) {
  chrome.storage.local.set({
    ':app/groups': JSON.stringify({ groups: groups })
  }, function () {

  });
});

Atom.listen(player, function(tracks) {
  chrome.storage.local.set({
    ':app/tracks': JSON.stringify({ tracks: tracks })
  }, function () {

  });
});
