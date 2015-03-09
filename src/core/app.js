var _ = require('underscore');
var Immutable = require('immutable');
var Bacon = require('baconjs');
var isString = require('underscore').isString;
var debug = require('debug')('app:core:app');
var isValue = require('app/utils/isValue');
var isDatom = require('app/utils/isDatom');
var eventBus = require('app/core/event-bus');
var BufferedEventStream = require('app/core/buffered-event-stream');
var Atom = require('app/core/atom');
var dispatch = require('app/core/dispatcher');

if (process.env.NODE_ENV === 'development') {
  var stats = require('app/core/stats');
}

var app = module.exports = new Atom(Immutable.Map());

var handlers = [];
var processNum = 0;
var dispatchStream = new BufferedEventStream(eventBus, function (v) {
  function doDispatch(datom) {
    if (process.env.NODE_ENV === 'development') {
      stats.time('dispatch[' + datom.a + ']');
    }

    dispatchStream.pause();
    debug('dispatch [%s %s %s] (s)', datom.e, datom.a, datom.v);
    var nextState = dispatch(Atom.value(app), handlers, datom);
    debug('dispatch [%s %s %s] (f)', datom.e, datom.a, datom.v);
    Atom.swap(app, nextState);
    dispatchStream.resume();

    if (process.env.NODE_ENV === 'development') {
      stats.timeEnd('dispatch[' + datom.a + ']');
    }
  }

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

    receivers.push([receiver, 'receive[' + expectedAttr + ']']);

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

function use(handler, name) {
  var receivers = [];
  var serviceName = typeof name === 'string' ? name : 'Service' + handlers.length;
  var onDbChange = handler(makeReceiver(receivers), send, makeMounter(makeReceiver(receivers), send));

  handlers.push.apply(handlers, receivers);

  if (_.isFunction(onDbChange)) {
    handlers.push([onDbChange, serviceName]);
  }
}

function start() {
  dispatchStream.resume();
  eventBus.push({ e: 'app', a: ':app/started', v: true });
}

function pause() {
  dispatchStream.pause();
}

function resume() {
  dispatchStream.resume();
}


function go(process) {
  processNum++;

  var id = [processNum, process.toString()].join(':');
  var output = new Bacon.Bus();
  var input = new Bacon.Bus();
  var errout = new Bacon.Bus();

  debug('spawn - %s', id);

  errout.onValue(function (err) {
    console.log(err);
  });

  output.onEnd(function() {
    debug('end - %s', id);
    input.end();
    errout.end();
  });

  process.go(input, output, errout);

  return output;
}

app.use = use;
app.start = start;
app.pause = pause;
app.resume = resume;
app.mount = mount;
app.go = go;
