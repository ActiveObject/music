var _ = require('underscore');
var curry = require('curry');
var sm = require('sound-manager');
var Track = require('app/values/track');

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
    },

    whileplaying: _.throttle(function () {
      if (this.readyState !== 0) {
        send('sound-manager:whileplaying', this.position);
      }
    }, 500),

    whileloading: _.throttle(function () {
      send('sound-manager:whileloading', {
        bytesLoaded: this.bytesLoaded,
        bytesTotal: this.bytesTotal
      });
    }, 500)
  });
}

var modifyTrackState = curry(function modifyTrackState(send, nextTrack, prevTrack) {
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

module.exports = function (receive, send, watch) {
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
    watch('player', modifyTrackState(send));
  });

  receive('sound-manager:whileplaying', function (appstate, position) {
    var player = appstate.get('player');

    if (!player.seeking) {
      return appstate.set('player', player.updatePosition(position));
    }
  });

  receive('sound-manager:whileloading', function (appstate, options) {
    return appstate.set('player', appstate.get('player').updateLoaded({
      bytesLoaded: options.bytesLoaded,
      bytesTotal: options.bytesTotal
    }));
  });

  receive('audio:seek-apply', function (appstate) {
    var player = appstate.get('player');
    var sound = sm.getSoundById(player.id);

    if (sound) {
      sound.setPosition(player.position);
    }

    return appstate.set('player', player.stopSeeking());
  });
};
