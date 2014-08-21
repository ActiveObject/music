var sm = require('sound-manager');
var isReady = false;

module.exports = function (appstate, type, data) {
  if (type === 'app:start') {
    sm.setup({
      url: 'swf',
      flashVersion: 9,
      preferFlash: false,
      onready: function() {
        isReady = true;
      }
    });

    return appstate;
  }

  // don't do anything while sound manager is initializing
  if (!isReady) {
    return appstate;
  }

  if (type === 'toggle:play') {
    var activeTrack = appstate.get('activeTrack');

    if (data.track.get('id') !== activeTrack.get('id')) {
      sm.stop(activeTrack.get('id'));
      sm.unload(activeTrack.get('id'));

      sm.createSound({
        id: data.track.get('id'),
        url: data.track.get('url'),
        autoLoad: true,
        autoPlay: true,
        volume: 100
      });

      return appstate.set('activeTrack', data.track.set('isPlaying', true));
    }

    sm.togglePause(activeTrack.get('id'));

    return appstate.set('activeTrack', activeTrack.set('isPlaying', !activeTrack.get('isPlaying')));
  }

  return appstate;
};