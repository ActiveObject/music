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
      send({ e: 'app/soundmanager', a: ':soundmanager/finish', v: track });
    },

    whileplaying: _.throttle(function () {
      if (this.readyState !== 0) {
        send({ e: 'app/soundmanager', a: ':soundmanager/position', v: this.position });
      }
    }, 500),

    whileloading: _.throttle(function () {
      send({ e: 'app/soundmanager', a: ':soundmanager/bytes-loaded', v: this.bytesLoaded });
      send({ e: 'app/soundmanager', a: ':soundmanager/bytes-total', v: this.bytesTotal });
    }, 500)
  });
}

var modifyTrackState = curry(function modifyTrackState(send, nextPlayer, prevPlayer) {
  if (nextPlayer.track.id !== prevPlayer.track.id && nextPlayer.isPlaying) {
    sm.stop(prevPlayer.track.id);
    sm.unload(prevPlayer.track.id);

    return getSound(nextPlayer.track, send).play();
  }

  if (nextPlayer.isPlaying && !prevPlayer.isPlaying) {
    return getSound(nextPlayer.track, send).play();
  }

  if (!nextPlayer.isPlaying && prevPlayer.isPlaying) {
    return getSound(nextPlayer.track, send).pause();
  }
});

module.exports = function (receive, send, watch) {
  receive(':app/started', function () {
    sm.setup({
      url: 'swf',
      flashVersion: 9,
      preferFlash: false,
      onready: function() {
        send({ e: 'app/soundmanager', a: ':soundmanager/is-ready', v: true });
      }
    });
  });

  receive(':soundmanager/is-ready', function () {
    watch('player', modifyTrackState(send));
  });

  receive(':player/position', function (appstate, v) {
    var player = appstate.get('player');
    var sound = sm.getSoundById(player.track.id);

    if (sound) {
      sound.setPosition(v);
    }
  });
};
