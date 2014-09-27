var sm = require('sound-manager');
var isReady = false;

function Watch(path, fn) {
  this.prevValue = null;
  this.path = path;
  this.fn = fn;
}

Watch.prototype.update = function (appstate) {
  if (!this.prevValue) {
    this.prevValue = appstate;
    return;
  }

  var prev = this.prevValue.get(this.path);
  var next = appstate.get(this.path);

  this.prevValue = appstate;

  if (next !== prev) {
    this.fn.call(null, next, prev);
  }
};

var activeTrack = new Watch('activeTrack', function (nextTrack, prevTrack) {
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
});

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

  activeTrack.update(appstate);

  return appstate;
};