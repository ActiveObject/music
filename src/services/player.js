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
    var queue = appstate.get('playqueue');

    if (queue.isLastTrack(track)) {
      return send('playqueue:finish');
    }

    return appstate.set('player', queue.nextAfter(track).play());
  });

  receive('app:start', function (appstate) {
    return appstate.update('playqueue', function (queue) {
      return queue.setSource(appstate.get('tracks'));
    });
  });

  receive('playqueue:update', function (appstate, queue) {
    if (appstate.get('player') === Player.empty && queue.tracks.size() > 0) {
      return appstate.set('playqueue', queue).set('player', Player.empty.modify({
        track: queue.tracks.first()
      }));
    }

    return appstate.set('playqueue', queue);
  });

  receive('audio:seek', function (appstate, position) {
    var player = appstate.get('player');
    return appstate.set('player', player.updatePosition(player.duration * position * 1000));
  });

  receive('audio:seek-start', function (appstate) {
    return appstate.set('player', appstate.get('player').startSeeking());
  });

  watch('tracks', function (tracks) {
    send('playqueue:update', db.value.get('playqueue').setSource(tracks));
  });
};
