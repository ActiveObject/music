var _ = require('underscore');
var debug = require('debug')('app:core:app');
var React = require('react');
var Bacon = require('baconjs');
var page = require('page');
var when = require('when');
var curry = require('curry');
var router = require('app/core/router');
var { isValue } = require('app/utils');


var handlers = [];
var appstate = null;
var appRouter = router();
var target = document.body;
var dbStream = new Bacon.Bus();

function renderTo(target) {
  return function renderTo(root) {
    React.renderComponent(root, target);
  };
}

function makeReceiver(receivers) {
  return function (expectedType, fn) {
    receivers.push(function (db, receivedType, payload) {
      var result;

      if (expectedType === receivedType) {
        result = fn(db, payload);
      }

      return isValue(result) ? result : db;
    });
  };
}

function receiveEvent(eventType, payload) {
  return function receive(expectedType, fn) {
    if (expectedType === eventType) {
      fn(payload);
    }
  };
}

use(function(dbStream, receive) {
  receive('route:change', function (db, data) {
    return db.set('location', data.ctx);
  });
});

page(function (ctx) {
  dispatch('route:change', { ctx: ctx });
});

function use(handler) {
  var receivers = [];
  var onDbChange = handler(dbStream, makeReceiver(receivers), dispatch);

  handlers.push.apply(handlers, receivers);

  if (_.isFunction(onDbChange)) {
    handlers.push(handler(dbStream));
  }
}

function dispatch(type, payload) {
  debug('dispatch - %s', type);

  var nextState = handlers.reduce(function (state, handler) {
    return handler(state, type, payload);
  }, appstate);

  debug('dispatch finished - %s', type);

  if (nextState.has('location') && nextState !== appstate) {
    window.requestAnimationFrame(() => render(appstate));
  }

  appstate = nextState;
  dbStream.push(nextState);
}

function registerRoute(path, fn) {
  appRouter.on(path, fn);
}

function render(appstate) {
  debug('render');
  when(appRouter(appstate))
    .then(renderTo(target));

  return appstate;
}

function start(initState) {
  appstate = initState;
  dbStream.push(appstate);
  dispatch('app:start');
  page();
}

exports.togglePlay = function (track) {
  dispatch('toggle:play', {
    track: track
  });
};

exports.renderTo = function (el) {
  target = el;
};

exports.r = function (path, middleware) {
  if (arguments.length === 1) {
    middleware = path;
    path = '*';
  }

  appRouter.use(path, middleware);
};

exports.use = use;
exports.on = registerRoute;
exports.start = start;
exports.dispatch = dispatch;
