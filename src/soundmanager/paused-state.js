var PlayingState = require('./playing-state');

function PausedState(attrs) {
  this.track = attrs.track;
  this.sound = attrs.sound;

  if (!this.sound.paused) {
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

PausedState.prototype.setPosition = function (v) {
  this.sound.setPosition(v);
  return this;
};

exports.create = function(attrs) {
  return new PausedState(attrs);
};
