var Track = require('app/models/track');

module.exports = function(dbStream, receive) {
  receive('toggle:play', function (appstate, data) {
    var activeTrack = appstate.get('activeTrack');

    if (data.track.id !== activeTrack.id) {
      return appstate.set('activeTrack', Track.play(data.track));
    }

    return appstate.set('activeTrack', Track.togglePlay(activeTrack));
  });
};