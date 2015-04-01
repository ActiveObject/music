var has = require('underscore').has;
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

getStoredValue(':app/albums', function (albums) {
  vbus.emit([':app/albums', JSON.parse(albums, revive).albums]);
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

Atom.listen(albums, function(albums) {
  chrome.storage.local.set({
    ':app/albums': JSON.stringify({ albums: albums })
  }, function () {

  });
});
