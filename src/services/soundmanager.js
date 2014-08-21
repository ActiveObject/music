var sm = require('sound-manager');

module.exports = function (appstate, type, data) {
  if (type === 'toggle:play') {
    var activeTrack = appstate.get('activeTrack');

    if (data.track.get('id') !== activeTrack.get('id')) {
      return appstate.set('activeTrack', data.track.set('isPlaying', true));
    }

    return appstate.set('activeTrack', activeTrack.set('isPlaying', !activeTrack.get('isPlaying')));
  }

  if (type === 'app:start') {
    sm.setup({
      url: 'swf',
      flashVersion: 9,
      preferFlash: false,
      onready: function() {
        console.log('sound-manager is ready');
      }
    });
  }

  return appstate;
};