var EventEmitter = require('events').EventEmitter;
var isObject = require('underscore').isObject;

function Atom(initialValue) {
  this.value = initialValue;
}

Atom.isAtomable = function(v) {
  return isObject(v) && Atom.isAtom(v.atom);
};

Atom.isAtom = function(v) {
  return EventEmitter.prototype.isPrototypeOf(v) &&
    typeof v.swap === 'function' &&
    typeof v.update === 'function';
};

Atom.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Atom, enumerable: false }
});

Atom.prototype.update = function (updater) {
  return this.swap(updater(this.value));
};

Atom.prototype.swap = function (newValue) {
  if (this.value !== newValue) {
    this.value = newValue;
    this.emit('change', this.value);
  }

  return this;
};

module.exports = Atom;
