var update = require('app/core/db').update;

module.exports = function(receive, send, watch) {
  receive(':soundmanager/finish', update('player', function (player) {
    return player.next();
  }));

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

  receive(':player/playlist', update('player', function (player, v) {
    return player.modify({ playlist: v });
  }));

  receive(':player/track', update('player', function (player, v) {
    return player.modify({ track: v });
  }));

  watch('tracks', function (tracks, prev, appstate) {
    send({
      e: 'app/player',
      a: ':player/playlist',
      v: appstate.get('player').playlist.update(tracks)
    });
  });
};
