var EventEmitter = require('events').EventEmitter;
var Bacon = require('baconjs');

function Atom(initialValue) {
  this.value = initialValue;
  this.changes = Bacon.fromEventTarget(this, 'change');
}

Atom.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Atom, enumerable: false }
});

Atom.prototype.update = function (updater) {
  this.value = updater(this.value);
  this.emit('change', this.value);
};

Atom.prototype.swap = function (newValue) {
  this.value = newValue;
  this.emit('change', this.value);
};

Atom.prototype.watchIn = function (key, callback) {
  var x = this.changes
    .map(db => db.get(key))
    .slidingWindow(2, 2)
    .filter(values => values[0] !== values[1]);

  var ref = this;

  return x.onValues(function (prev, next) {
    callback(next, prev, ref.value);
  });
};

module.exports = Atom;
