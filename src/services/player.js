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

  receive('playlist:update', update('player', function (player) {
    return player.setPlaylist(this.get('tracks'));
  }));

  receive('audio:seek', update('player', function (player, position) {
    return player.seek(position);
  }));

  receive('audio:seek-start', update('player', function (player) {
    return player.startSeeking();
  }));

  watch('tracks', function (tracks) {
    send('playlist:update');
  });
};
