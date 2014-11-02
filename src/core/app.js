var _ = require('underscore');
var debug = require('debug')('app:core:app');
var React = require('react');
var Bacon = require('baconjs');
var when = require('when');
var curry = require('curry');
var BufferedEventStream = require('app/core/buffered-event-stream');
var { isValue } = require('app/utils');


var handlers = [];
var appstate = null;
var target = document.body;
var dbStream = new Bacon.Bus();

var appEventStream = new BufferedEventStream(function (event) {
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

  var nextState = next(appstate, handlers);

  debug('%s - dispatch finished', type);

  if (nextState !== appstate) {
    window.requestAnimationFrame(function () {
      render(appstate);
    });
  }

  appstate = nextState;
  dbStream.push(nextState);

  appEventStream.resume();
}

function render(appstate) {
  var layout = appstate.get('layout');

  debug('layout started');
  var root = layout(appstate);
  debug('layout finished');

  React.renderComponent(root, target);
}

function start(initState) {
  appstate = initState;
  dbStream.push(appstate);
  appEventStream.resume();
  dispatch('app:start');
}

exports.togglePlay = function (track) {
  scheduleEvent('toggle:play', {
    track: track
  });
};

exports.seekAudio = function (position) {
  scheduleEvent('audio:seek', position);
};

exports.seekAudioApply = function () {
  scheduleEvent('audio:seek-apply');
};

exports.startSeeking = function () {
  scheduleEvent('audio:seek-start');
};

exports.renderTo = function (el) {
  target = el;
};

exports.use = use;
exports.start = start;
exports.send = scheduleEvent;
