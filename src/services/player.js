var Player = require('app/values/player');
var db = require('app/core/db');

function update(path, updater) {
  return function(appstate) {
    var args = Array.prototype.slice.call(arguments, 1);
    return appstate.update(path, function(value) {
      args.unshift(value);
      return updater.apply(appstate, args);
    });
  };
}

module.exports = function(receive, send, watch) {
  receive('toggle:play', update('player', function (player, data) {
    return player.togglePlay(data.track);
  }));

  receive('sound-manager:finish', update('player', function (player) {
    return player.next();
  }));

  receive('sound-manager:whileloading', update('player', function (player, data) {
    return player.updateLoaded({
      bytesLoaded: data.bytesLoaded,
      bytesTotal: data.bytesTotal
    });
  }));

  receive('sound-manager:whileplaying', function (appstate, position) {
    var player = appstate.get('player');

    if (!player.seeking) {
      return appstate.set('player', player.updatePosition(position));
    }
  });

  receive('playlist:update', update('player', function (player) {
    return player.setPlaylist(this.get('tracks'));
  }));

  receive('audio:seek', update('player', function (player, position) {
    return player.seek(position);
  }));

  receive('audio:seek-start', update('player', function (player) {
    return player.startSeeking();
  }));

  receive('audio:seek-apply', update('player', function (player) {
    return player.stopSeeking();
  }));

  watch('tracks', function (tracks) {
    send('playlist:update');
  });
};
