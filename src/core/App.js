var React = require('react');
var page = require('page');
var when = require('when');
var curry = require('curry');
var Router = require('app/core/router');

function renderTo(target) {
  return function renderTo(root) {
    React.renderComponent(root, target);
  };
}

function App(init) {
  this.state = init;
  this.router = new Router();
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
  this.router.use(renderTo(el));
};

App.prototype.start = function () {
  page(this.dispatch.bind(this));
  page();
};

App.prototype.dispatch = function (ctx) {
  return this.router(this.state, ctx, function (app) {
    console.log('dispatch is finished ', app);
  });
};

module.exports = App;