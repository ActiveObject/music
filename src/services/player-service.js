var player = require('app/values/player');

function update(key, updater) {
  return function updateDb(db) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(db.get(key));
    return db.set(key, updater.apply(db, args));
  };
}

module.exports = function(receive, send) {
  receive(':soundmanager/bytes-loaded', update('player', (p, v) => p.modify({ bytesLoaded: v })))
  receive(':soundmanager/bytes-total', update('player', (p, v) => p.modify({ bytesTotal: v })))
  receive(':soundmanager/position', update('player', (p, v) => p.modify({ position: v })))

  receive(':soundmanager/finish', function (appstate) {
    send({ e: 'app', a: ':app/player', v: appstate.get('player').nextTrack().play() });
  });

  receive(':app/player', (appstate, v) => appstate.set('player', v));
  receive(':app/started', appstate => appstate.set('player', player));

  receive(':app/tracks', function(appstate) {
    var player = appstate.get('player');
    var tracks = appstate.get('tracks');

    if (player.tracklist.type === 'library') {
      return appstate.update('player', function (player) {
        return player.useTracklist(player.tracklist.update(tracks));
      });
    }

    if (player.tracklist.type === 'artist') {
      return appstate.update('player', function (player) {
        return player.useTracklist(player.tracklist.update(tracks))
      });
    }
  });
};
