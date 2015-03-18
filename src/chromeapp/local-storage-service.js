var ISet = require('immutable').Set;
var has = require('underscore').has;
var NewsfeedActivity = require('app/values/newsfeed-activity');
var Track = require('app/values/track');
var Group = require('app/values/group');
var firstValue = require('app/utils/firstValue');
var revive = require('app/core/revive');
var vbus = require('app/core/vbus');

function getStoredValue(key, fn) {
  chrome.storage.local.get(key, function (items) {
    if (has(items, key)) {
      fn(items[key]);
    }
  });
}

module.exports = function (receive) {
  // receive(':app/started', function(appstate) {
  //   getStoredValue(':player/track', function (track) {
  //     vbus.push(appstate.get('player').useTrack(firstValue(JSON.parse(track, revive))));
  //   });
  // });

  receive(':app/started', function() {
    getStoredValue(':app/activity', function (activity) {
      vbus.push([':app/activity', JSON.parse(activity, revive).activities]);
    });
  });

  receive(':app/started', function () {
    getStoredValue(':app/tracks', function (tracks) {
      vbus.push([ ':app/tracks', JSON.parse(tracks, revive).tracks]);
    });
  });

  receive(':app/started', function () {
    getStoredValue(':app/groups', function (groups) {
      vbus.push([':app/groups', JSON.parse(groups, revive).groups]);
    });
  });

  // receive(':app/player', function (appstate, player) {
  //   if (player.track !== appstate.get('player').track) {
  //     chrome.storage.local.set({
  //       ':player/track': JSON.stringify(player.track)
  //     }, function () {

  //     });
  //   }
  // });

  // receive(':app/activity', function (appstate, activities) {
  //   chrome.storage.local.set({
  //     ':app/activity': JSON.stringify({
  //       activities: appstate.get('activities').union(activities)
  //     })
  //   }, function () {

  //   });
  // });

  // receive(':app/tracks', function (appstate, tracks) {
  //   chrome.storage.local.set({
  //     ':app/tracks': JSON.stringify({ tracks: tracks })
  //   }, function () {

  //   });
  // });

  // receive(':app/groups', function (appstate, groups) {
  //   chrome.storage.local.set({
  //     ':app/groups': JSON.stringify({ groups: groups })
  //   }, function () {

  //   });
  // });
};
