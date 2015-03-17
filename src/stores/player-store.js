var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var tagOf = require('app/utils/tagOf');
var player = require('app/values/player');

var p = module.exports = new Atom(player);

vbus
  .filter(v => tagOf(v) === ':app/player')
  .onValue(v => p.swap(v));