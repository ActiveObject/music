var _ = require('underscore'),
    Q = require('app/query'),
    RemoteResource = require('app/values/remote-resource'),
    isEmpty = require('app/utils').isEmpty;

module.exports = function(dbStream, receive, send, watch) {
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
    var tracks = appstate.get('playqueue').tracks;
    var activeIndex = tracks.findIndex(function (t) {
      return t.id === track.id;
    });

    if (activeIndex === tracks.count()) {
      return send('playqueue:finish');
    }

    return appstate.set('activeTrack', tracks.get(activeIndex + 1).play());
  });

  receive('app:start', function (appstate) {
    return appstate.update('playqueue', function (queue) {
      return queue.setSource(appstate.get('tracks').items);
    });
  });

  receive('playqueue:update', function (appstate, queue) {
    return appstate.set('playqueue', queue);
  });

  watch('tracks', function (prev, next, appstate) {
    var items = RemoteResource.is(next) ? next.data.items : next.items.filter(_.negate(isEmpty));
    send('playqueue:update', appstate.get('playqueue').setSource(items));
  });
};