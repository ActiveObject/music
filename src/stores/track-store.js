var ISet = require('immutable').Set;
var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var tagOf = require('app/utils/tagOf');

var TrackStore = module.exports = new Atom(ISet());

vbus
  .filter(v => tagOf(v) === ':app/tracks')
  .onValue(([tag, v]) => TrackStore.swap(v));