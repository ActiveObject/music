var Bacon = require('baconjs');

var eventBus = new Bacon.Bus();

eventBus.send = function (type, payload) {
  eventBus.push({
    type: type,
    payload: payload
  });
};

eventBus.togglePlay = function (track, playlist) {
  eventBus.push({
    type: 'toggle:play',
    payload: {
      track: track,
      playlist: playlist
    }
  });
};

eventBus.seekAudio = function (position) {
  eventBus.push({
    type: 'audio:seek',
    payload: position
  });
};

eventBus.seekAudioApply = function () {
  eventBus.push({
    type: 'audio:seek-apply'
  });
};

eventBus.startSeeking = function () {
  eventBus.push({
    type: 'audio:seek-start'
  });
};

module.exports = eventBus;
