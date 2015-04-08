var Kefir = require('kefir');
var player = require('app/values/player');
var db = require('app/core/db3');
var tagOf = require('app/utils/tagOf');

module.exports = db.scanEntity(player, (acc, v) => tagOf(v) === ':app/player' ? v : acc);
module.exports.changes = Kefir.fromEvent(module.exports, 'change');
