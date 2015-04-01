var Kefir = require('kefir');
var Atom = require('app/core/atom');
var player = require('app/values/player');

module.exports = new Atom(player);
module.exports.changes = Kefir.fromEvent(module.exports, 'change');