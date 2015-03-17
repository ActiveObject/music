var ISet = require('immutable').Set;
var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var tagOf = require('app/utils/tagOf');

var GroupStore = module.exports = new Atom(ISet());

vbus
  .filter(v => tagOf(v) === ':app/groups')
  .onValue(([tag, v]) => GroupStore.swap(v));