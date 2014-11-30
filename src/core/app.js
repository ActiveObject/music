var _ = require('underscore');
var debug = require('debug')('app:core:app');
var React = require('react');
var BufferedEventStream = require('app/core/buffered-event-stream');
var { isValue } = require('app/utils');
var appstate = require('app/core/db');
var eventBus = require('app/core/event-bus');

var handlers = [];
var target = document.body;
var appEventStream = new BufferedEventStream(eventBus, function (v) {
  if (Array.isArray(v)) {
    return v.filter(isDatom).forEach(dispatch);
  }

  if (isDatom(v)) {
    return dispatch(v);
  }
});

function makeReceiver(receivers) {
  return function createReceiverForEvent(expectedAttr, fn) {
    receivers.push(function (db, datom) {
      var result;

      if (expectedAttr === datom.a) {
        result = fn(db, datom.v, datom);
      }

      return isValue(result) ? result : db;
    });
  };
}

function addWatch(db) {
  return function watch(key, callback) {
    return db.watchIn(key, callback);
  };
}

function isDatom(v) {
  return _.isObject(v) && _.every(['e', 'a', 'v'], function (key) {
    return _.has(v, key);
  });
}

function scheduleEvent(v) {
  if (isDatom(v)) {
    eventBus.push(v);
  }
}

function use(handler) {
  var receivers = [];
  var onDbChange = handler(makeReceiver(receivers), scheduleEvent, addWatch(appstate));

  handlers.push.apply(handlers, receivers);

  if (_.isFunction(onDbChange)) {
    handlers.push(onDbChange);
  }
}

function dispatch(datom) {
  appEventStream.pause();

  debug('[%s %s %s] dispatch started', datom.e, datom.a, datom.v);

  function next(state, handlers) {
    if (handlers.length === 0) {
      return state;
    }

    var handler = handlers[0];

    if (handler.length === 3) {
      return handler(state, datom, function (appstate) {
        return next(appstate, handlers.slice(1));
      });
    }

    return next(handler(state, datom), handlers.slice(1));
  }

  var nextState = next(appstate.value, handlers);

  debug('[%s %s %s] dispatch finished', datom.e, datom.a, datom.v);

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

  dispatch({ e: 'app', a: ':app/started', v: true });
}

exports.renderTo = function (el) {
  target = el;
};

exports.use = use;
exports.start = start;
