var _ = require('underscore');
var curry = require('curry');
var sm = require('sound-manager');

var modifyTrackState = curry(function modifyTrackState(send, prevTrack, nextTrack) {
  if (nextTrack.id !== prevTrack.id) {
    sm.stop(prevTrack.id);
    sm.unload(prevTrack.id);

    var sound = sm.getSoundById(nextTrack.id);

    if (_.isObject(sound)) {
      return sound.play();
    }

    return sm.createSound({
      id: nextTrack.id,
      url: nextTrack.url,
      autoLoad: true,
      autoPlay: true,
      volume: 100,
      onfinish: function () {
        send('sound-manager:finish', nextTrack);
      }
    });
  }

  if (nextTrack.isPlaying && !prevTrack.isPlaying) {
    return sm.play(nextTrack.id);
  }

  if (!nextTrack.isPlaying && prevTrack.isPlaying) {
    return sm.pause(nextTrack.id);
  }
});

module.exports = function (dbStream, receive, send, watch) {
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
    watch('activeTrack', modifyTrackState(send));
  });
};