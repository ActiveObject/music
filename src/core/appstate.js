var Immutable = require('immutable');
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

module.exports.mount = function(receive, send, v, options) {
  if (!Atom.isAtomable(v)) {
    throw new TypeError('')
  }

  var e = options.e,
      a = options.a,
      mountPoint = options.mountPoint;

  v.atom.on('change', function (newState) {
    send({ e: e, a: a, v: newState });
  });

  receive(a, function (appstate, v) {
    return appstate.set(mountPoint, v);
  });

  receive(':app/started', function(appstate) {
    return appstate.set(mountPoint, v.atom.value);
  });
};
