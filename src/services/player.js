var Player = require('app/values/player');
var db = require('app/core/db');

module.exports = function(receive, send, watch) {
  receive('toggle:play', function (appstate, data) {
    var player = appstate.get('player');

    if (data.track.id !== player.id) {
      return appstate.set('player', data.track.play());
    }

    return appstate.update('player', function (track) {
      return track.togglePlay();
    });
  });

  receive('sound-manager:finish', function (appstate, track) {
    var playlist = appstate.get('playlist');

    if (playlist.isLastTrack(track)) {
      return send('playlist:finish');
    }

    return appstate.set('player', playlist.nextAfter(track).play());
  });

  receive('app:start', function (appstate) {
    return appstate.update('playlist', function (playlist) {
      return playlist.setSource(appstate.get('tracks'));
    });
  });

  receive('playlist:update', function (appstate, playlist) {
    if (appstate.get('player') === Player.empty && playlist.tracks.size() > 0) {
      return appstate.set('playlist', playlist).set('player', Player.empty.modify({
        track: playlist.tracks.first()
      }));
    }

    return appstate.set('playlist', playlist);
  });

  receive('audio:seek', function (appstate, position) {
    var player = appstate.get('player');
    return appstate.set('player', player.updatePosition(player.duration * position * 1000));
  });

  receive('audio:seek-start', function (appstate) {
    return appstate.set('player', appstate.get('player').startSeeking());
  });

  watch('tracks', function (tracks) {
    send('playlist:update', db.value.get('playlist').setSource(tracks));
  });
};
