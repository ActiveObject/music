var _ = require('underscore');
var curry = require('curry');
var sm = require('sound-manager');

function getSound(track, send) {
  var sound = sm.getSoundById(track.id);

  if (_.isObject(sound)) {
    return sound;
  }

  return sm.createSound({
    id: track.id,
    url: track.url,
    autoLoad: false,
    autoPlay: false,
    volume: 100,
    onfinish: function () {
      send('sound-manager:finish', track);
    }
  });
}

var modifyTrackState = curry(function modifyTrackState(send, prevTrack, nextTrack) {
  if (nextTrack.id !== prevTrack.id && nextTrack.isPlaying) {
    sm.stop(prevTrack.id);
    sm.unload(prevTrack.id);

    return getSound(nextTrack, send).play();
  }

  if (nextTrack.isPlaying && !prevTrack.isPlaying) {
    return getSound(nextTrack, send).play();
  }

  if (!nextTrack.isPlaying && prevTrack.isPlaying) {
    return getSound(nextTrack, send).pause();
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