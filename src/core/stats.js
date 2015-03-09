/* global performance */

var _ = require('underscore');
var stats = [];
var pending = {};

function avg (items) {
  return Number((_.reduce(items, function(memo, num){ return memo + num; }, 0) / items.length).toFixed(3));
}

module.exports = stats;

module.exports.print = function printStats() {
  var services = _.groupBy(stats, 'name');
  var result = _.mapObject(services, function(val, key) {
    var durations = _.map(val, function(item) {
      return item.endTime - item.startTime;
    });

    return {
      event: key,
      'max (ms)': Number(_.max(durations).toFixed(3)),
      'avg (ms)': avg(durations),
      count: durations.length
    };
  });

  console.table(_.values(result));
  return result;
};

module.exports.time = function(name) {
  pending[name] = performance.now();
};

module.exports.timeEnd = function(name) {
  if (pending[name]) {
    stats.push({
      name: name,
      startTime: pending[name],
      endTime: performance.now()
    });

    pending[name] = null;
  }
};
