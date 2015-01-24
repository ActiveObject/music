var ISet = require('immutable').Set;
var NewsfeedActivity = require('app/values/newsfeed-activity');
var Track = require('app/values/track');
var Group = require('app/values/group');

module.exports = function (receive, send) {
  receive(':app/started', function() {
    if (localStorage.hasOwnProperty(':player/track')) {
      send({
        e: 'app/player',
        a: ':player/track',
        v: JSON.parse(localStorage.getItem(':player/track'))
      });
    }
  });

  receive(':app/started', function() {
    if (localStorage.hasOwnProperty(':app/activity')) {
      send({
        e: 'app',
        a: ':app/activity',
        v: JSON.parse(localStorage.getItem(':app/activity')).map(v => new NewsfeedActivity(v))
      });
    }
  });

  receive(':app/started', function () {
    if (localStorage.hasOwnProperty(':app/tracks')) {
      send({
        e: 'app',
        a: ':app/tracks',
        v: ISet(JSON.parse(localStorage.getItem(':app/tracks')).map(v => new Track(v)))
      });
    }
  });

  receive(':app/started', function () {
    if (localStorage.hasOwnProperty(':app/groups')) {
      send({
        e: 'app',
        a: ':app/groups',
        v: JSON.parse(localStorage.getItem(':app/groups')).map(v => new Group(v))
      });
    }
  });

  receive(':player/track', function (appstate, track) {
    localStorage.setItem(':player/track', JSON.stringify(track));
  });

  receive(':app/activity', function (appstate) {
    localStorage.setItem(':app/activity', JSON.stringify(appstate.get('activities').toArray()));
  });

  receive(':app/tracks', function (appstate) {
    localStorage.setItem(':app/tracks', JSON.stringify(appstate.get('tracks').toArray()));
  });

  receive(':app/groups', function (appstate) {
    localStorage.setItem(':app/groups', JSON.stringify(appstate.get('groups').toArray()));
  });
};
