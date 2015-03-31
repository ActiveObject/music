var writer = require('./writer');
var reader = require('./reader');

function TimeRecord(history) {
  this.history = history;
}

TimeRecord.fromTransit = function(v) {
  return new TimeRecord(reader('json').read(v));
};

TimeRecord.prototype.play = function(db) {
  var next = (items) => {
    if (items.length === 0) {
      return;
    }

    if (items.length === 1) {
      db.tick(items[0].value);
      return;
    }

    db.tick(items[0].value);
    setTimeout(next.bind(null, items.slice(1)), items[1].time - items[0].time);
  };

  next(this.history);
};

TimeRecord.prototype.toTransit = function(callback) {
  return writer('json').write(this.history);
};

module.exports = TimeRecord;
