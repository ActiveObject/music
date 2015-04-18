var db = require('app/core/db3');
var changelog = require('app/core/db/producers/changelog');
var seq = require('app/core/db/producers/seq');

var writer = require('./writer');
var reader = require('./reader');

function TimeRecord(history) {
  this.history = history;
}

TimeRecord.fromTransit = function (v) {
  return new TimeRecord(reader('json').read(v));
};

TimeRecord.prototype.play = function () {
  var event = seq(0);
  db.modify(changelog([]));
  var next = (items) => {
    if (items.length === 0) {
      return console.log('STOP');
    }

    if (items.length === 1) {
      db.modify(event(items[0].value));
      return console.log('STOP');
    }

    db.modify(event(items[0].value));
    setTimeout(next.bind(null, items.slice(1)), items[1].time - items[0].time);
  };

  next(this.history);
};

TimeRecord.prototype.seekTo = function (n) {
  db.modify(changelog(this.history.slice(0, n).map(v => v.value)));
};

TimeRecord.prototype.toTransit = function () {
  return writer('json').write(this.history);
};

module.exports = TimeRecord;
