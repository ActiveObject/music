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

  receive('sound-manager:finish', function (appstate, track) {
    var tracks = appstate.get('playqueue').items;
    var activeIndex = tracks.findIndex(t => t.id === track.id);

    if (activeIndex === tracks.count()) {
      return send('playqueue:finish');
    }

    return appstate.set('activeTrack', Track.play(tracks.get(activeIndex + 1)));
  });

  receive('playqueue:change', function (appstate, tracks) {
    return appstate.update('playqueue', function (playqueue) {
      return {
        source: playqueue.source,
        items: tracks.items.filter(_.negate(Track.isEmpty))
      };
    });
  });

  receive('playqueue:change', function (appstate, tracks) {
    if (Track.isEmpty(appstate.get('activeTrack'))) {
      var nonEmptyTracks = tracks.items.filter(_.negate(Track.isEmpty));

      if (nonEmptyTracks.count() > 0) {
        return appstate.set('activeTrack', nonEmptyTracks.first());
      }
    }
  });

  watch('tracks', function (prev, next) {
    send('playqueue:change', next);
  });
};