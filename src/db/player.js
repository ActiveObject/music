var Kefir = require('kefir');
var Atom = require('app/core/atom');
var player = require('app/values/player');
var db = require('app/core/db3');
var tagOf = require('app/utils/tagOf');
var scan = require('app/core/db/consumers/scan');

var p = new Atom(player);

db.install(scan(player, (acc, v) => tagOf(v) === ':app/player' ? v : acc))
  .onValue(v => Atom.swap(p, v));

module.exports = p;
module.exports.changes = Kefir.fromEvent(module.exports, 'change');
