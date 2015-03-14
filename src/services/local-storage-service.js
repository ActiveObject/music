var revive = require('app/core/revive');
var firstValue = require('app/utils/firstValue');

module.exports = function (receive, send) {
  receive(':app/started', function(appstate) {
    if (localStorage.hasOwnProperty(':player/track')) {
      var track = firstValue(JSON.parse(localStorage.getItem(':player/track'), revive));

      send(appstate.get('player').useTrack(track));
    }
  });

  receive(':app/started', function() {
    if (localStorage.hasOwnProperty(':app/activity')) {
      send([':app/activity', JSON.parse(localStorage.getItem(':app/activity'), revive).activities]);
    }
  });

  receive(':app/started', function () {
    if (localStorage.hasOwnProperty(':app/tracks')) {
      send([':app/tracks', JSON.parse(localStorage.getItem(':app/tracks'), revive).tracks]);
    }
  });

  receive(':app/started', function () {
    if (localStorage.hasOwnProperty(':app/groups')) {
      send([':app/groups', JSON.parse(localStorage.getItem(':app/groups'), revive).groups]);
    }
  });

  receive(':app/player', function (appstate, player) {
    if (player.track !== appstate.get('player')) {
      localStorage.setItem(':player/track', JSON.stringify(player.track));
    }
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
