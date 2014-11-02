var Track = require('app/values/track');
var Q = require('app/query');

module.exports = function(dbStream, receive, send) {
  receive('toggle:play', function (appstate, data) {
    var activeTrack = appstate.get('activeTrack');

    if (data.track.id !== activeTrack.id) {
      return appstate.set('activeTrack', Track.play(data.track));
    }

    return appstate.update('activeTrack', Track.togglePlay);
  });

  receive('sound-manager:finish', function (appstate, track) {
    var tracks = Q.getPlayqueueItems(appstate);
    var activeIndex = tracks.findIndex(t => t.id === track.id);

    if (activeIndex === tracks.count()) {
      return send('playqueue:finish');
    }

    return appstate.set('activeTrack', Track.play(tracks.get(activeIndex + 1)));
  });
};