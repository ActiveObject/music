var EventEmitter = require('events').EventEmitter;
var EmptyLayout = require('app/layout/empty-layout');

function LayoutManager(state) {
  this.state = state;
}

LayoutManager.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: LayoutManager, enumerable: false }
});

LayoutManager.prototype.changeState = function (newState) {
  if (this.state !== newState) {
    this.state = newState;
    this.emit('change', newState);
  }

  return this;
};

LayoutManager.prototype.auth = function (vkAccount) {
  return this.changeState(this.state.auth({ vkAccount: vkAccount }));
};

LayoutManager.prototype.group = function (id) {
  return this.changeState(this.state.group({ id: id }));
};

LayoutManager.prototype.artist = function (name) {
  return this.changeState(this.state.artist({ name: name }));
};

LayoutManager.prototype.main = function () {
  return this.changeState(this.state.main());
};

module.exports = new LayoutManager(EmptyLayout.create());
