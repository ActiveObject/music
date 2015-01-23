var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var isObject = require('underscore').isObject;
var isFunction = require('underscore').isFunction;

function Atom(initialValue) {
  this.value = initialValue;
  this.atom = this;
}

Atom.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Atom, enumerable: false }
});

Atom.prototype.swap = function (newValue) {
  if (this.value !== newValue) {
    var oldValue = this.value;
    this.value = newValue;
    this.emit('change', newValue, oldValue);
  }

  return this;
};

Atom.isAtomable = function(v) {
  return isObject(v) && Atom.isAtom(v.atom);
};

Atom.isAtom = function(v) {
  return EventEmitter.prototype.isPrototypeOf(v) && isFunction(v.swap);
};

Atom.update = function(x, updater) {
  assert(Atom.isAtomable(x), 'Atom.update: trying to update non-atomable object, given ' + x);
  return x.atom.swap(updater(x.atom.value));
};

Atom.swap = function(x, newValue) {
  assert(Atom.isAtomable(x), 'Atom.swap: trying to update non-atomable object, given ' + x);
  return x.atom.swap(newValue);
};

Atom.listen = function(x, onChange) {
  assert(Atom.isAtomable(x), 'Atom.swap: trying to update non-atomable object, given ' + x);
  return x.atom.on('change', onChange);
};

Atom.off = function (x) {
  assert(Atom.isAtomable(x), 'Atom.off: trying to cleanup non-atomable object, given ' + x);
  return x.atom.removeAllListeners();
};

Atom.value = function (x) {
  assert(Atom.isAtomable(x), 'Atom.valuee: trying to get a value of a non-atomable object, given ' + x);
  return x.atom.value;
};

module.exports = Atom;
