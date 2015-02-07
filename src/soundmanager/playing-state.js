var PausedState = require('./paused-state');

function PlayingState(attrs) {
  this.track = attrs.track;
  this.sound = attrs.sound;

  if (this.sound.paused) {
    this.sound.resume();
  } else {
    this.sound.play();
  }
}

PlayingState.prototype.toJSON = function () {
  return {
    'soundmanager:playing-state': {
      track: this.track
    }
  };
};

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

PlayingState.prototype.setPosition = function (pos) {
  this.sound.setPosition(pos);
  return this;
};

exports.create = function(attrs) {
  return new PlayingState(attrs);
};
