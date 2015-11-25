var PausedState = require('./paused-state');

function PlayingState(attrs) {
  this.track = attrs.track;
  this.sound = attrs.sound;
  this.tag = ':sm/playing';

  if (this.sound.paused) {
    this.sound.resume();
  } else {
    this.sound.play();
  }
}

PlayingState.prototype.useTrack = function (track, sound) {
  this.sound.stop();
  this.sound.unload();

  return new PlayingState({
    track: track,
    sound: sound
  });
};

PlayingState.prototype.play = function () {
  return this;
};

PlayingState.prototype.pause = function () {
  return PausedState.create({
    track: this.track,
    sound: this.sound
  });
};

exports.create = function(attrs) {
  return new PlayingState(attrs);
};
