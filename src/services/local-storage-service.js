var revive = require('app/core/revive');
var firstValue = require('app/utils/firstValue');

module.exports = function (receive, send) {
  receive(':app/started', function() {
    if (localStorage.hasOwnProperty(':player/track')) {
      send({
        e: 'app/player',
        a: ':player/track',
        v: firstValue(JSON.parse(localStorage.getItem(':player/track'), revive))
      });
    }
  });

  receive(':app/started', function() {
    if (localStorage.hasOwnProperty(':app/activity')) {
      send({
        e: 'app',
        a: ':app/activity',
        v: JSON.parse(localStorage.getItem(':app/activity'), revive).activities
      });
    }
  });

  receive(':app/started', function () {
    if (localStorage.hasOwnProperty(':app/tracks')) {
      send({
        e: 'app',
        a: ':app/tracks',
        v: JSON.parse(localStorage.getItem(':app/tracks'), revive).tracks
      });
    }
  });

  receive(':app/started', function () {
    if (localStorage.hasOwnProperty(':app/groups')) {
      send({
        e: 'app',
        a: ':app/groups',
        v: JSON.parse(localStorage.getItem(':app/groups'), revive).groups
      });
    }
  });

  receive(':player/track', function (appstate, track) {
    localStorage.setItem(':player/track', JSON.stringify(track));
  });

  receive(':app/activity', function (appstate) {
    localStorage.setItem(':app/activity', JSON.stringify({ activities: appstate.get('activities') }));
  });

  receive(':app/tracks', function (appstate) {
    localStorage.setItem(':app/tracks', JSON.stringify({ tracks: appstate.get('tracks') }));
  });

  receive(':app/groups', function (appstate) {
    localStorage.setItem(':app/groups', JSON.stringify({ groups: appstate.get('groups') }));
  });
};
