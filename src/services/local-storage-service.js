var vbus = require('app/core/vbus');
var revive = require('app/core/revive');
var firstValue = require('app/utils/firstValue');

module.exports = function (receive) {
  // receive(':app/started', function(appstate) {
  //   if (localStorage.hasOwnProperty(':player/track')) {
  //     var track = firstValue(JSON.parse(localStorage.getItem(':player/track'), revive));

  //     vbus.push(appstate.get('player').useTrack(track));
  //   }
  // });

  receive(':app/started', function() {
    if (localStorage.hasOwnProperty(':app/activity')) {
      vbus.push([':app/activity', JSON.parse(localStorage.getItem(':app/activity'), revive).activities]);
    }
  });

  receive(':app/started', function () {
    if (localStorage.hasOwnProperty(':app/tracks')) {
      vbus.push([':app/tracks', JSON.parse(localStorage.getItem(':app/tracks'), revive).tracks]);
    }
  });

  receive(':app/started', function () {
    if (localStorage.hasOwnProperty(':app/groups')) {
      vbus.push([':app/groups', JSON.parse(localStorage.getItem(':app/groups'), revive).groups]);
    }
  });

  // receive(':app/player', function (appstate, player) {
  //   if (player.track !== appstate.get('player')) {
  //     localStorage.setItem(':player/track', JSON.stringify(player.track));
  //   }
  // });

  // receive(':app/activity', function (appstate, activities) {
  //   localStorage.setItem(':app/activity', JSON.stringify({
  //     activities: appstate.get('activities').union(activities)
  //   }));
  // });

  // receive(':app/tracks', function (appstate, tracks) {
  //   localStorage.setItem(':app/tracks', JSON.stringify({ tracks: tracks }));
  // });

  // receive(':app/groups', function (appstate, groups) {
  //   localStorage.setItem(':app/groups', JSON.stringify({ groups: groups }));
  // });
};
