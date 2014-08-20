var React = require('react');
var page = require('page');
var when = require('when');
var curry = require('curry');
var router = require('app/core/router');
var cursor = require('app/core/cursor');

function renderTo(target) {
  return function renderTo(root) {
    React.renderComponent(root, target);
  };
}

function App(init) {
  this.state = init;
  this.cursor = cursor(this.getState.bind(this), this.render.bind(this));
  this.location = this.cursor.cursor('location');
  this.router = router(this.cursor.cursor.bind(this.cursor));
  this.target = document.body;

  page(this.dispatch.bind(this));
}

App.prototype.use = function (path, middleware) {
  if (arguments.length === 1) {
    middleware = path;
    path = '*';
  }

  this.router.use(path, middleware);

  return this;
};

App.prototype.on = function (path, fn) {
  this.router.on(path, fn);
};

App.prototype.renderTo = function (el) {
  this.target = el;
};

App.prototype.render = function (appstate) {
  console.log('render app', appstate.toJS());

  this.state = appstate;

  when(this.router(appstate))
    .then(renderTo(this.target));
};

App.prototype.dispatch = function (ctx) {
  this.location(function (value, update) {
    update(ctx);
  });
};

App.prototype.getState = function () {
  return this.state;
};

App.prototype.start = function () {
  page();
};

module.exports = App;