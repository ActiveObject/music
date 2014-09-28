var sm = require('sound-manager');
var Bacon = require('baconjs');
var isReady = false;

var dbStream = new Bacon.Bus();
var activeTrack = dbStream
  .map(db => db.get('activeTrack'))
  .slidingWindow(2, 2)
  .filter(values => values[0] !== values[1]);

function modifyTrackState(prevTrack, nextTrack) {
  if (nextTrack.id !== prevTrack.id) {
    sm.stop(prevTrack.id);
    sm.unload(prevTrack.id);

    return sm.createSound({
      id: nextTrack.id,
      url: nextTrack.url,
      autoLoad: true,
      autoPlay: true,
      volume: 100
    });
  }

  if (nextTrack.isPlaying && !prevTrack.isPlaying) {
    return sm.play(nextTrack.id);
  }

  if (!nextTrack.isPlaying && prevTrack.isPlaying) {
    return sm.pause(nextTrack.id);
  }
}

module.exports = function (appstate, type, data, receive, send) {
  dbStream.push(appstate);

  receive('app:start', function () {
    sm.setup({
      url: 'swf',
      flashVersion: 9,
      preferFlash: false,
      onready: function() {
        send('sound-manager:is-ready');
      }
    });
  });

  receive('sound-manager:is-ready', function () {
    activeTrack.onValues(modifyTrackState);
  });

  return appstate;
};