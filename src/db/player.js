var Kefir = require('kefir');
var Atom = require('app/core/atom');
var player = require('app/values/player');
var db3 = require('app/core/db3');
var dbin = require('app/core/dbin');
var tagOf = require('app/utils/tagOf');

var p = new Atom(player);

db3.install(db3.scan(player, (acc, v) => tagOf(v) === ':app/player' ? v : acc), dbin).onValue(v => Atom.swap(p, v));

module.exports = p;
module.exports.changes = Kefir.fromEvent(module.exports, 'change');
