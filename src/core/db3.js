var Kefir = require('kefir');
var List = require('immutable').List;

function Db() {
  this.history = List();
}

Db.prototype.add = function (transform) {
  this.history = transform(this.history, (acc, v) => acc.push(v), List());
  return this.history;
};

Db.prototype.install = function (fn, vbus) {
  return fn(this.history, vbus);
};

var vbus = Kefir.bus();


function seq(initValue) {
  var i = initValue;

  return function event(v) {
    var item = { id: i++, value: v };

    return function (history, combine) {
      return combine(history, item);
    };
  };
}

function changelog(vs) {
  return function (history, combine, initValue) {
    return vs.map((v, i) => ({ id: i, value: v })).reduce(combine, initValue);
  }
}

function scan(initValue, combine) {
  return function (history, changes) {
    var state = history.reduce((acc, v) => combine(acc, v.value), initValue);

    return changes.scan(function (acc, transform) {
      return transform(acc, (acc, v) => combine(acc, v.value), initValue);
    }, state);
  };
}

function scanSince(n, initValue, combine) {
  return function (history, changes) {
    var state = history.reduce(function (acc, v) {
      return v.id >= n ? combine(acc, v.value) : acc;
    }, initValue);

    return changes.scan(function (acc, transform) {
      return transform(acc, function (acc, v) {
        return v.id >= n ? combine(acc, v.value) : acc;
      }, initValue);
    }, state);
  };
}

function scanChanges(initValue, combine) {
  return function (history, changes) {
    return changes.scan(function (acc, transform) {
      return transform(acc, (acc, v) => combine(acc, v.value), initValue);
    }, initValue);
  };
}

var db = new Db();

vbus
  .map(v => db.add(v))
  .map(vs => vs.map(v => v.id + ':' + v.value))
  .onValue(v => v)
  // .log('history');

var event = seq(0);


vbus.emit(event(1));
vbus.emit(event(2));
vbus.emit(event(3));

db.install(scan(0, (a, b) => a + b), vbus).log('scan');
db.install(scanSince(2, 0, (a, b) => a + b), vbus).log('scanSince');

vbus.emit(event(4));
vbus.emit(event(5));
vbus.emit(event(8));
vbus.emit(changelog([1,5,10]));
vbus.emit(event(11))
vbus.emit(changelog([1,9,9,9]))

var stream = db.install(scanChanges(0, (a, b) => a + b), vbus);
stream.log('scanChanges');
vbus.emit(event(12));
vbus.emit(event(14));
stream.offLog('scanChanges');
vbus.emit(event(15));