var sm = require('sound-manager');
var isReady = false;

function Watch(path, fn) {
  this.prevValue = null;
  this.path = path;
  this.fn = fn;
}

Watch.prototype.update = function (appstate) {
  if (!this.prevValue) {
    return this.prevValue = appstate;
  }

  var prev = this.prevValue.get(this.path);
  var next = appstate.get(this.path);

  this.prevValue = appstate;

  if (next !== prev) {
    this.fn.call(null, next, prev);
  }
};

var activeTrack = new Watch('activeTrack', function (nextTrack, prevTrack) {
  if (nextTrack.get('id') !== prevTrack.get('id')) {
    sm.stop(prevTrack.get('id'));
    sm.unload(prevTrack.get('id'));

    return sm.createSound({
      id: nextTrack.get('id'),
      url: nextTrack.get('url'),
      autoLoad: true,
      autoPlay: true,
      volume: 100
    });
  }

  if (nextTrack.get('isPlaying') && !prevTrack.get('isPlaying')) {
    return sm.play(nextTrack.get('id'));
  }

  if (!nextTrack.get('isPlaying') && prevTrack.get('isPlaying')) {
    return sm.pause(nextTrack.get('id'));
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