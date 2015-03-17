var vbus = require('app/core/vbus');
var player = require('app/values/player');

function update(key, updater) {
  return function updateDb(db) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(db.get(key));
    return db.set(key, updater.apply(db, args));
  };
}

// var tagOf = require('app/utils/tagOf');

module.exports = function(receive) {
  // vbus
  //   .filter(v => tagOf(v) === ':soundmanager/bytes-loaded')
  //   .onValue(function () { debugger });

  receive(':soundmanager/bytes-loaded', update('player', (p, v) => p.modify({ bytesLoaded: v })));
  receive(':soundmanager/bytes-total', update('player', (p, v) => p.modify({ bytesTotal: v })));
  receive(':soundmanager/position', update('player', (p, v) => p.modify({ position: v })));

  receive(':soundmanager/finish', function (appstate) {
    vbus.push(appstate.get('player').nextTrack().play());
  });

  receive(':app/player', (appstate, v) => appstate.set('player', v));
  receive(':app/started', appstate => appstate.set('player', player));

  receive(':app/tracks', function(appstate, tracks) {
    var player = appstate.get('player');

    if (player.tracklist.type === 'library') {
      return appstate.update('player', function (player) {
        return player.useTracklist(player.tracklist.update(tracks));
      });
    }

    if (player.tracklist.type === 'artist') {
      return appstate.update('player', function (player) {
        return player.useTracklist(player.tracklist.update(tracks));
      });
    }
  });
};
