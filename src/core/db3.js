var Kefir = require('kefir');
var List = require('immutable').List;
var events = List();
var stream = Kefir.bus();

exports.stream = stream;
exports.install = (fn) => fn(events, stream);

stream.onValue(function (transform) {
  events = transform(events, (acc, v) => acc.push(v), List());
  return events;
});
