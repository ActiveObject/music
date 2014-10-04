var _ = require('underscore');
var Track = require('app/models/track');

module.exports = function(dbStream, receive, send, watch) {
  receive('toggle:play', function (appstate, data) {
    var activeTrack = appstate.get('activeTrack');

    if (data.track.id !== activeTrack.id) {
      return appstate.set('activeTrack', Track.play(data.track));
    }

    return appstate.update('activeTrack', Track.togglePlay);
  });

  receive('playqueue:change', function (appstate, tracks) {
    return appstate.update('playqueue', function (playqueue) {
      return {
        source: playqueue.source,
        items: tracks.items.filter(_.negate(Track.isEmpty))
      }
    });
  });

  watch('tracks', function (prev, next) {
    send('playqueue:change', next);
  });
};