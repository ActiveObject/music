var Immutable = require('immutable');
var isString = require('underscore').isString;
var Atom = require('app/core/atom');
var player = require('app/values/player');
var tracks = require('app/values/tracks');
var groups = require('app/values/groups');
var layout = require('app/layout');
var vk = require('app/vk');
var sm = require('app/soundmanager');

module.exports = new Atom(Immutable.Map());

module.exports.toJSON = function() {
  return this.value.filterNot(function(val, key) {
    return key === 'soundmanager';
  }).toJSON();
};

module.exports.update = function update(key, updater) {
  return function updateDb(db) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(db.get(key));
    return db.set(key, updater.apply(db, args));
  };
};

module.exports.mount = function(receive, send, service) {
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
};
