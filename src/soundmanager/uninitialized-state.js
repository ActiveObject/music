var ReadyState = require('./ready-state');

function UninitializedState() {

}

UninitializedState.prototype.setup = function (options) {
  return ReadyState.create(options);
};

UninitializedState.prototype.play = function () {
  return this;
};

UninitializedState.prototype.pause = function () {
  return this;
};

UninitializedState.prototype.useTrack = function () {
  return this;
};

UninitializedState.prototype.setPosition = function () {
  return this;
};

exports.create = function() {
  return new UninitializedState();
};
