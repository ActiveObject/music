var _ = require('underscore');
var debug = require('debug')('app:core:app');
var React = require('react');
var BufferedEventStream = require('app/core/buffered-event-stream');
var { isValue } = require('app/utils');
var appstate = require('app/core/db');
var eventBus = require('app/core/event-bus');

var handlers = [];
var target = document.body;
var appEventStream = new BufferedEventStream(eventBus, function (event) {
  dispatch(event.type, event.payload);
});

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

function addWatch(db) {
  return function watch(key, callback) {
    return db.watchIn(key, callback);
  };
}

function scheduleEvent(type, payload) {
  eventBus.push({ type: type, payload: payload });
}

function use(handler) {
  var receivers = [];
  var onDbChange = handler(makeReceiver(receivers), scheduleEvent, addWatch(appstate));

  handlers.push.apply(handlers, receivers);

  if (_.isFunction(onDbChange)) {
    handlers.push(onDbChange);
  }
}

function dispatch(type, payload) {
  appEventStream.pause();

  debug('%s - dispatching', type);

  function next(state, handlers) {
    if (handlers.length === 0) {
      return state;
    }

    var handler = handlers[0];

    if (handler.length === 4) {
      return handler(state, type, payload, function (appstate) {
        return next(appstate, handlers.slice(1));
      });
    }

    return next(handler(state, type, payload), handlers.slice(1));
  }

  var nextState = next(appstate.value, handlers);

  debug('%s - dispatch finished', type);

  if (nextState !== appstate.value) {
    appstate.swap(nextState);
  }

  appEventStream.resume();
}

function render(appstate) {
  var layout = appstate.get('layout');

  debug('layout started');
  var root = layout.render(appstate, scheduleEvent);
  debug('layout finished');

  React.renderComponent(root, target);
}

function start() {
  appEventStream.resume();

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      render(appstate.value);
    }
  }, false);

  appstate.on('change', function (value) {
    if (!document.hidden) {
      window.requestAnimationFrame(function () {
        render(value);
      });
    }
  });

  dispatch('app:start');
}

exports.renderTo = function (el) {
  target = el;
};

exports.use = use;
exports.start = start;
