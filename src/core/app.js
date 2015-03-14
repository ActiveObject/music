var _ = require('underscore');
var Immutable = require('immutable');
var Bacon = require('baconjs');
var isString = require('underscore').isString;
var debug = require('debug')('app:core:app');
var isValue = require('app/utils/isValue');
var isDatom = require('app/utils/isDatom');
var vbus = require('app/core/vbus');
var BufferedEventStream = require('app/core/buffered-event-stream');
var Atom = require('app/core/atom');
var dispatch = require('app/core/dispatcher');

if (process.env.NODE_ENV === 'development') {
  var stats = require('app/core/stats');
}

var app = module.exports = new Atom(Immutable.Map());

var handlers = [];
var processNum = 0;

function tagOf(v) {
  if (typeof v === 'string') {
    return v;
  }

  if (Array.isArray(v)) {
    return v[0];
  }

  if (typeof v.tag === 'function') {
    return v.tag();
  }

  if (isDatom(v)) {
    return v.a;
  }

  throw new TypeError('Unknown vbus value', v);
}

function valueOf(v) {
  if (typeof v === 'string') {
    return v;
  }

  if (Array.isArray(v)) {
    return v[1];
  }

  if (typeof v.tag === 'function') {
    return v;
  }

  if (isDatom(v)) {
    return v.v;
  }

  throw new TypeError('Unknown vbus value', v);
}


var dispatchStream = new BufferedEventStream(vbus, function (v) {
  if (process.env.NODE_ENV === 'development') {
    stats.time('dispatch[' + tagOf(v) + ']');
  }

  dispatchStream.pause();
  debug('dispatch [%s] (s)', tagOf(v));
  var nextState = dispatch(Atom.value(app), handlers, v);
  debug('dispatch [%s] (f)', tagOf(v));
  Atom.swap(app, nextState);
  dispatchStream.resume();

  if (process.env.NODE_ENV === 'development') {
    stats.timeEnd('dispatch[' + tagOf(v) + ']');
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
  return function receive(expectedTag, fn) {
    var receiver = function (appstate, v) {
      var result;

      if (expectedTag === tagOf(v)) {
        result = fn(appstate, valueOf(v));
      }

      return isValue(result) ? result : appstate;
    };

    receivers.push([receiver, 'receive[' + expectedTag + ']']);

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
  vbus.push(v);
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
  vbus.push(':app/started');
}

function pause() {
  dispatchStream.pause();
}

function resume() {
  dispatchStream.resume();
}

function isRunning() {
  return dispatchStream.isRunning();
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
app.isRunning = isRunning;
app.mount = mount;
app.go = go;
