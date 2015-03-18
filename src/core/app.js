var _ = require('underscore');
var Immutable = require('immutable');
var isString = require('underscore').isString;
var debug = require('debug')('app:core:app');
var vbus = require('app/core/vbus');
var BufferedEventStream = require('app/core/buffered-event-stream');
var Atom = require('app/core/atom');
var dispatch = require('app/core/dispatcher');

var isValue = require('app/utils/isValue');
var tagOf = require('app/utils/tagOf');
var valueOf = require('app/utils/valueOf');

if (process.env.NODE_ENV === 'development') {
  var stats = require('app/core/stats');
}

var app = module.exports = new Atom(Immutable.Map());

function mount(receive, service) {
  if (!Atom.isAtomable(service)) {
    throw new TypeError('Mount target should implement atomable protocol');
  }

  if (!isString(service.mountPoint)) {
    throw new TypeError('Mount target should have a mountPoint as string but given ' + service.mountPoint);
  }

  var a = ':app/' + service.mountPoint;

  service.atom.on('change', function (newState) {
    vbus.push([a, newState]);
  });

  receive(a, function (appstate, v) {
    return appstate.set(service.mountPoint, v);
  });

  receive(':app/started', function(appstate) {
    return appstate.set(service.mountPoint, service.atom.value);
  });
}

app.mount = mount;
