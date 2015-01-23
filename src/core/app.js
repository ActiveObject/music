var _ = require('underscore');
var Immutable = require('immutable');
var isString = require('underscore').isString;
var debug = require('debug')('app:core:dispatcher');
var isValue = require('app/utils/isValue');
var isDatom = require('app/utils/isDatom');
var eventBus = require('app/core/event-bus');
var BufferedEventStream = require('app/core/buffered-event-stream');
var Atom = require('app/core/atom');
var dispatch = require('app/core/dispatcher');


var app = module.exports = new Atom(Immutable.Map());

var handlers = [];
var appEventStream = new BufferedEventStream(eventBus, function (v) {
  if (Array.isArray(v)) {
    return v.filter(isDatom).forEach(doDispatch);
  }

  if (isDatom(v)) {
    return doDispatch(v);
  }
});

function mount(receive, send, service) {
  if (!Atom.isAtomable(service)) {
    throw new TypeError('Mount target should implement atomable protocol');
  }

  if (!isString(service.mountPoint)) {
    throw new TypeError('Mount target should have a mountPoint as string but given ' + service.mountPoint);
  }

  var e = 'app',
      a = ':app/' + service.mountPoint;

  service.atom.on('change', function (newState) {
    send({ e: e, a: a, v: newState });
  });

  receive(a, function (appstate, v) {
    return appstate.set(service.mountPoint, v);
  });

  receive(':app/started', function(appstate) {
    return appstate.set(service.mountPoint, service.atom.value);
  });
}

function makeReceiver(receivers) {
  return function receive(expectedAttr, fn) {
    var receiver = function (appstate, datom) {
      var result;

      if (expectedAttr === datom.a) {
        result = fn(appstate, datom.v, datom);
      }

      return isValue(result) ? result : appstate;
    };

    receivers.push(receiver);

    return function () {
      for (var i = 0, l = handlers.length; i < l; i++) {
        if (handlers[i] === receiver) {
          handlers.splice(i, 1);
        }
      }
    };
  };
}

function makeMounter(receive, send) {
  return function mountAtomable(atomable, options) {
    return mount(receive, send, atomable, options);
  };
}

function send(v) {
  eventBus.push(v);
}

function use(handler) {
  var receivers = [];
  var onDbChange = handler(makeReceiver(receivers), send, makeMounter(makeReceiver(receivers), send));

  handlers.push.apply(handlers, receivers);

  if (_.isFunction(onDbChange)) {
    handlers.push(onDbChange);
  }
}

function doDispatch(datom) {
  appEventStream.pause();
  debug('[%s %s %s] (s)', datom.e, datom.a, datom.v);
  var nextState = dispatch(Atom.value(app), handlers, datom);
  debug('[%s %s %s] (f)', datom.e, datom.a, datom.v);
  Atom.swap(app, nextState);
  appEventStream.resume();
}

function start() {
  appEventStream.resume();
  doDispatch({ e: 'app', a: ':app/started', v: true });
}

function pause() {
  appEventStream.pause();
}

function resume() {
  appEventStream.resume();
}

app.use = use;
app.start = start;
app.pause = pause;
app.resume = resume;
app.mount = mount;