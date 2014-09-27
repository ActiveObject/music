var Track = require('app/models/track');

module.exports = function (appstate, type, data, dispatch) {
  if (type === 'toggle:play') {
    var activeTrack = appstate.get('activeTrack');

    if (data.track.id !== activeTrack.id) {
      return appstate.set('activeTrack', Track.play(data.track));
    }

    return appstate.set('activeTrack', Track.togglePlay(activeTrack));
  }

  return appstate;
};