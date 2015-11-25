var PlayingState = require('./playing-state');

function PausedState(attrs) {
  this.track = attrs.track;
  this.sound = attrs.sound;
  this.tag = ':sm/paused';

  if (this.sound && !this.sound.paused) {
    this.sound.pause();
  }
}

PausedState.prototype.useTrack = function (track, sound) {
  this.sound.stop();
  this.sound.unload();

  return new PausedState({
    track: track,
    sound: sound
  });
};

PausedState.prototype.play = function () {
  return PlayingState.create({
    track: this.track,
    sound: this.sound,
    position: this.position
  });
};

PausedState.prototype.pause = function () {
  return this;
};

exports.create = function(attrs) {
  return new PausedState(attrs);
};
