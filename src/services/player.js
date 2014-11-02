var Q = require('app/query');

module.exports = function(dbStream, receive, send) {
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
    var tracks = Q.getPlayqueueItems(appstate);
    var activeIndex = tracks.findIndex(function (t) {
      return t.id === track.id;
    });

    if (activeIndex === tracks.count()) {
      return send('playqueue:finish');
    }

    return appstate.set('activeTrack', tracks.get(activeIndex + 1).play());
  });
};