module.exports = function (appstate, type, data) {
  if (type === 'toggle:play') {
    var activeTrack = appstate.get('activeTrack');

    if (data.track.get('id') !== activeTrack.get('id')) {
      return appstate.set('activeTrack', data.track.set('isPlaying', true));
    }

    return appstate.set('activeTrack', activeTrack.set('isPlaying', !activeTrack.get('isPlaying')));
  }

  return appstate;
};