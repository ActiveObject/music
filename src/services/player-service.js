var player = require('app/values/player');

function update(key, updater) {
  return function updateDb(db) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(db.get(key));
    return db.set(key, updater.apply(db, args));
  };
}

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
    if (Object.keys(player.track).length === 0 && v.playlist.tracks.size > 0) {
      send(player.useTrack(v.playlist.tracks.first()));
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

  receive(':app/tracks', function(appstate) {
    var player = appstate.get('player');
    var tracks = appstate.get('tracks');

    if (player.tracklist.type === 'library') {
      send(player.useTracklist(player.tracklist.update(tracks)));
    }

    if (player.tracklist.type === 'artist') {
      send(player.useTracklist(player.tracklist.update(tracks)));
    }
  });
};
