var writer = require('./writer');
var reader = require('./reader');

function TimeRecord(history) {
  this.history = history;
}

TimeRecord.fromTransit = function(v) {
  return new TimeRecord(reader('json').read(v));
};

TimeRecord.prototype.play = function(app, render) {
  app.pause();

  var next = (items) => {
    if (items.length === 0) {
      return app.resume();
    }

    if (items.length === 1) {
      render(items[0].value);
      return app.resume();
    }

    render(items[0].value);
    setTimeout(next.bind(null, items.slice(1)), items[1].time - items[0].time);
  };

  next(this.history);
};

TimeRecord.prototype.toTransit = function(callback) {
  var propsToOmit = ['vk', 'soundmanager'];

  var records = this.history.map(function(v) {
    return {
      time: v.time,
      value: v.value.filterNot((v, k) => propsToOmit.indexOf(k) !== -1)
    };
  });

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
  return writer('json').write(records);
};

module.exports = TimeRecord;
