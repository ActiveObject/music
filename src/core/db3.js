var Kefir = require('kefir');
var List = require('immutable').List;
var events = List();
var stream = Kefir.bus();

function scanner(consumer) {
  return function (acc, producer) {
    return producer(fn => consumer(events, acc, fn));
  }
}

exports.install = function (consume) {
  return stream.scan(scanner(consume), consume(events));
};

exports.modify = function (produce) {
  stream.emit(produce);
  events = produce(fn => fn(events, List(), (acc, v) => acc.push(v)));
  return events;
};

