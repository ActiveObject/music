var React = require('react');

function AppState(init) {
  this.state = init(this);
  this.target = document.body;
}

AppState.prototype.renderTo = function(el) {
  this.target = document.querySelector(el);
};

AppState.prototype.start = function(makeApp) {
  this.make = makeApp;
  this.render();
};

AppState.prototype.render = function() {
  React.renderComponent(this.make(this.state), this.target);
};

module.exports = AppState;