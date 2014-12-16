var PausedState = require('./paused-state');
var PlayingState = require('./playing-state');

function ReadyState(attrs) {
  this.track = attrs.track;
  this.sound = attrs.sound;
}

ReadyState.prototype.play = function () {
  if (!this.track || !this.sound) {
    return this;
  }

  return PlayingState.create({
    track: this.track,
    sound: this.sound
  });
};

ReadyState.prototype.pause = function () {
  if (!this.track || !this.sound) {
    return this;
  }

  return PausedState.create({
    track: this.track,
    sound: this.sound
  });
};

ReadyState.prototype.useTrack = function (track, sound) {
  return new ReadyState({
    track: track,
    sound: sound
  });
};

ReadyState.prototype.setPosition = function () {
  return this;
};

exports.create = function(attrs) {
  return new ReadyState(attrs);
};
