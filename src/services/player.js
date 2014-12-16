var update = require('app/core/appstate').update;
var player = require('app/values/player');

module.exports = function(receive, send) {
  receive(':soundmanager/bytes-loaded', update('player', function (player, v) {
    return player.modify({ bytesLoaded: v });
  }));

  receive(':soundmanager/bytes-total', update('player', function (player, v) {
    return player.modify({ bytesTotal: v });
  }));

  receive(':soundmanager/position', update('player', function (player, v) {
    return player.modify({ position: v });
  }));

  receive(':player/is-playing', update('player', function (player, v) {
    return player.modify({ isPlaying: v });
  }));

  receive(':player/position', update('player', function (player, v) {
    return player.modify({ position: v });
  }));

  receive(':player/seek-position', update('player', function (player, v) {
    return player.modify({ seekPosition: v });
  }));

  receive(':player/seeking', update('player', function (player, v) {
    return player.modify({ seeking: v });
  }));

  receive(':player/tracklist', update('player', function (player, v) {
    if (Object.keys(player.track).length === 0 && v.tracks.size > 0) {
      send(player.useTrack(v.tracks.first()));
    }

    return player.modify({ tracklist: v });
  }));

  receive(':player/track', update('player', function (player, v) {
    return player.modify({ track: v });
  }));

  receive(':player/visible-tracklist', update('player', function (player, v) {
    return player.setVisibleTracklist(v);
  }));

  receive(':soundmanager/finish', function (appstate) {
    send(appstate.get('player').nextTrack());
  });

  receive(':app/started', function(appstate) {
    return appstate.set('player', player);
  });
};
