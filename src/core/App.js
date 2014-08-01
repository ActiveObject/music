var React = require('react');

function App(init) {
  this.state = init(this);
  this.target = document.body;
}

App.prototype.renderTo = function (el) {
  this.target = document.querySelector(el);
};

App.prototype.layout = function () {
  var views = this.state.views;

  if (!views || !Array.isArray(views)) {
    throw new Error('The app should have some views to render');
  }

  if (views.length === 0) {
    throw new Error('There is not any view to layout');
  }

  return views[0].layout(this.state);
};

App.prototype.render = function () {
  React.renderComponent(this.layout(), this.target);
};

module.exports = App;