var ActiveTrack = require('app/values/active-track');

module.exports = function(receive, send, watch) {
  receive('toggle:play', function (appstate, data) {
    var activeTrack = appstate.get('activeTrack');

    if (data.track.id !== activeTrack.id) {
      return appstate.set('activeTrack', data.track.play());
    }

    return appstate.update('activeTrack', function (track) {
      return track.togglePlay();
    });
  });

  receive('sound-manager:finish', function (appstate, track) {
    var queue = appstate.get('playqueue');

    if (queue.isLastTrack(track)) {
      return send('playqueue:finish');
    }

    return appstate.set('activeTrack', queue.nextAfter(track).play());
  });

  receive('app:start', function (appstate) {
    return appstate.update('playqueue', function (queue) {
      return queue.setSource(appstate.get('tracks'));
    });
  });

  receive('playqueue:update', function (appstate, queue) {
    if (appstate.get('activeTrack') === ActiveTrack.empty && queue.tracks.size() > 0) {
      return appstate.set('playqueue', queue).set('activeTrack', ActiveTrack.empty.modify({
        track: queue.tracks.all.first()
      }));
    }

    return appstate.set('playqueue', queue);
  });

  receive('audio:seek', function (appstate, position) {
    var activeTrack = appstate.get('activeTrack');
    return appstate.set('activeTrack', activeTrack.updatePosition(activeTrack.duration * position * 1000));
  });

  receive('audio:seek-start', function (appstate) {
    return appstate.set('activeTrack', appstate.get('activeTrack').startSeeking());
  });

  receive('tracks:update', function (appstate, tracks) {
    send('playqueue:update', appstate.get('playqueue').setSource(tracks));
  });
};