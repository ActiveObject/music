var ReadyState = require('./ready-state');

function UninitializedState(attrs) {
  this.track = attrs.track;
  this.sound = attrs.sound;
}

UninitializedState.prototype.setup = function () {
  return ReadyState.create({
    track: this.track,
    sound: this.sound
  });
};

UninitializedState.prototype.play = function () {
  return this;
};

UninitializedState.prototype.pause = function () {
  return this;
};

UninitializedState.prototype.useTrack = function (track, sound) {
  return new UninitializedState({
    track: track,
    sound: sound
  });
};

exports.create = function (attrs) {
  return new UninitializedState(attrs);
};
