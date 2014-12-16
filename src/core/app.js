var _ = require('underscore');
var debug = require('debug')('app:core:dispatcher');
var { isValue } = require('app/utils');
var appstate = require('app/core/appstate');
var eventBus = require('app/core/event-bus');
var BufferedEventStream = require('app/core/buffered-event-stream');

var handlers = [];
var appEventStream = new BufferedEventStream(eventBus, function (v) {
  if (Array.isArray(v)) {
    return v.filter(isDatom).forEach(dispatch);
  }

  if (isDatom(v)) {
    return dispatch(v);
  }
});

function makeReceiver(receivers) {
  return function receive(expectedAttr, fn) {
    receivers.push(function (appstate, datom) {
      var result;

      if (expectedAttr === datom.a) {
        result = fn(appstate, datom.v, datom);
      }

      return isValue(result) ? result : appstate;
    });
  };
}

function watch(key, callback) {
  return appstate.watchIn(key, callback);
}

function makeMounter(receive, send) {
  return function mount(atomable, options) {
    return appstate.mount(receive, send, atomable, options);
  };
}

function send(v) {
  eventBus.push(v);
}

function isDatom(v) {
  return _.isObject(v) && _.every(['e', 'a', 'v'], function (key) {
    return _.has(v, key);
  });
}

function use(handler) {
  var receivers = [];
  var onDbChange = handler(makeReceiver(receivers), send, watch, makeMounter(makeReceiver(receivers), send));

  handlers.push.apply(handlers, receivers);

  if (_.isFunction(onDbChange)) {
    handlers.push(onDbChange);
  }
}

function dispatch(datom) {
  appEventStream.pause();

  debug('[%s %s %s] (s)', datom.e, datom.a, datom.v);

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

  debug('[%s %s %s] (f)', datom.e, datom.a, datom.v);

  if (nextState !== appstate.value) {
    appstate.swap(nextState);
  }

  appEventStream.resume();
}

function start() {
  appEventStream.resume();
  dispatch({ e: 'app', a: ':app/started', v: true });
}

exports.use = use;
exports.start = start;
