var ISet = require('immutable').Set;
var has = require('underscore').has;
var NewsfeedActivity = require('app/values/newsfeed-activity');
var Track = require('app/values/track');
var Group = require('app/values/group');
var firstValue = require('app/utils/firstValue');
var revive = require('app/core/revive');

function getStoredValue(key, fn) {
  chrome.storage.local.get(key, function (items) {
    if (has(items, key)) {
      fn(items[key]);
    }
  });
}

module.exports = function (receive, send) {
  receive(':app/started', function() {
    getStoredValue(':player/track', function (track) {
      send({
        e: 'app/player',
        a: ':player/track',
        v: firstValue(JSON.parse(track, revive))
      });
    });
  });

  receive(':app/started', function() {
    getStoredValue(':app/activity', function (activity) {
      send({
        e: 'app',
        a: ':app/activity',
        v: JSON.parse(activity, revive).activities
      });
    });
  });

  receive(':app/started', function () {
    getStoredValue(':app/tracks', function (tracks) {
      send({
        e: 'app',
        a: ':app/tracks',
        v: JSON.parse(tracks, revive).tracks
      });
    });
  });

  receive(':app/started', function () {
    getStoredValue(':app/groups', function (groups) {
      send({
        e: 'app',
        a: ':app/groups',
        v: JSON.parse(groups, revive).groups
      });
    });
  });

  receive(':player/track', function (appstate, track) {
    chrome.storage.local.set({
      ':player/track': JSON.stringify(track)
    }, function () {

    });
  });

  receive(':app/activity', function (appstate) {
    chrome.storage.local.set({
      ':app/activity': JSON.stringify({ activities: appstate.get('activities') })
    }, function () {

    });
  });

  receive(':app/tracks', function (appstate) {
    chrome.storage.local.set({
      ':app/tracks': JSON.stringify({ tracks: appstate.get('tracks') })
    }, function () {

    });
  });

  receive(':app/groups', function (appstate) {
    chrome.storage.local.set({
      ':app/groups': JSON.stringify({ groups: appstate.get('groups') })
    }, function () {

    });
  });
};
