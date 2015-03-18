var writer = require('./writer');
var reader = require('./reader');

function TimeRecord(history) {
  this.history = history;
}

TimeRecord.fromTransit = function(v) {
  return new TimeRecord(reader('json').read(v));
};

TimeRecord.prototype.play = function(vbus) {
  var next = (items) => {
    if (items.length === 0) {
      // return app.resume();
      return;
    }

    if (items.length === 1) {
      vbus.push(items[0].value);
      // return app.resume();
      return;
    }

    vbus.push(items[0].value);
    setTimeout(next.bind(null, items.slice(1)), items[1].time - items[0].time);
  };

  next(this.history);
};

TimeRecord.prototype.toTransit = function(callback) {
  // var process = function (items, res) {
  //   if (items.length === 0) {
  //     console.log('done');
  //     return callback('[' + res.join(',') + ']');
  //   }

  //   console.log('processing... (%s)', (1 - items.length / records.length) * 100);
  //   var ret = writer.write(items.slice(0, 1));
  //   res.push(ret);
  //   setTimeout(() => process(items.slice(1), res), 0);
  // };

  // process(records, []);
  return writer('json').write(this.history);
};

module.exports = TimeRecord;
