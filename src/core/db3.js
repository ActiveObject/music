var Kefir = require('kefir');
var List = require('immutable').List;
var Atom = require('app/core/atom');
var scan = require('app/core/db/consumers/scan');
var events = List();
var stream = Kefir.bus();

function scanner(consumer) {
  return function (acc, producer) {
    return consumer(events, acc, producer);
  };
}

function install(consume) {
  return stream.scan(scanner(consume), consume(events));
}

function modify(produce) {
  events = produce(events, List(), (acc, v) => acc.push(v));
  stream.emit(produce);
  return events;
}

function scanEntity(seed, combine) {
  var entity = new Atom(seed);
  install(scan(seed, combine)).onValue(v => Atom.swap(entity, v));
  return entity;
}

exports.install = install;
exports.modify = modify;
exports.scanEntity = scanEntity;
