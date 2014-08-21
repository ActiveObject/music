var debug = require('debug')('app:core:app');
var React = require('react');
var page = require('page');
var when = require('when');
var curry = require('curry');
var router = require('app/core/router');

function renderTo(target) {
  return function renderTo(root) {
    React.renderComponent(root, target);
  };
}

var handlers = [];
var db = null;
var appRouter = router();
var target = document.body;

exports.r = function (path, middleware) {
  if (arguments.length === 1) {
    middleware = path;
    path = '*';
  }

  appRouter.use(path, middleware);
};

function registerRoute(path, fn) {
  appRouter.on(path, fn);
}

function render(appstate) {
  when(appRouter(appstate))
    .then(renderTo(target));

  return appstate;
}

function start(initState) {
  db = initState;
  dispatch('app:start');
  page();
}

function use(handler) {
  handlers.push(handler);
}

function dispatch(type, payload) {
  debug('dispatching started %s', type);

  db = handlers.reduce(function (db, handler) {
    return handler(db, type, payload);
  }, db);

  debug('dispatching finished %s', type);

  if (db.has('location')) {
    render(db);
  }
}

use(function (appstate, type, data) {
  if (type === 'route:change') {
    return appstate.set('location', data.ctx);
  }

  return appstate;
});

page(function (ctx) {
  dispatch('route:change', { ctx: ctx });
});

exports.togglePlay = function (track) {
  dispatch('toggle:play', {
    track: track
  });
};

exports.renderTo = function (el) {
  target = el;
};

exports.use = use;
exports.on = registerRoute;
exports.start = start;
exports.dispatch = dispatch;
