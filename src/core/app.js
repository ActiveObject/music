var _ = require('underscore');
var debug = require('debug')('app:core:app');
var React = require('react');
var Bacon = require('baconjs');
var page = require('page');
var when = require('when');
var curry = require('curry');
var router = require('app/core/router');
var BufferedEventStream = require('app/core/buffered-event-stream');
var { isValue } = require('app/utils');


var handlers = [];
var appstate = null;
var appRouter = router();
var target = document.body;
var dbStream = new Bacon.Bus();

var appEventStream = new BufferedEventStream(function (event) {
  dispatch(event.type, event.payload);
});

function renderTo(target) {
  return function renderTo(root) {
    React.renderComponent(root, target);
  };
}

function makeReceiver(receivers) {
  return function createReceiverForEvent(expectedType, fn) {
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

function addWatch(dbStream) {
  return function watch(key, callback) {
    var x = dbStream
      .map(db => db.get(key))
      .slidingWindow(2, 2)
      .filter(values => values[0] !== values[1]);

    return x.onValues(function (prev, next) {
      callback(prev, next, appstate);
    });
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
  var onDbChange = handler(dbStream, makeReceiver(receivers), scheduleEvent, addWatch(dbStream));

  handlers.push.apply(handlers, receivers);

  if (_.isFunction(onDbChange)) {
    handlers.push(onDbChange);
  }
}

function scheduleEvent(type, payload) {
  appEventStream.push({ type: type, payload: payload });
}

function dispatch(type, payload) {
  appEventStream.pause();

  debug('%s - dispatching', type);

  var nextState = handlers.reduce(function (state, handler) {
    return handler(state, type, payload);
  }, appstate);

  debug('%s - dispatch finished', type);

  if (nextState.has('location') && nextState !== appstate) {
    window.requestAnimationFrame(() => render(appstate));
  }

  appstate = nextState;
  dbStream.push(nextState);

  appEventStream.resume();
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
  appEventStream.resume();
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
exports.dispatch = scheduleEvent;
