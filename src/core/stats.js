var _ = require('underscore');
var stats = [];

function avg (items) {
  return Number((_.reduce(items, function(memo, num){ return memo + num; }, 0) / items.length).toFixed(4));
}

window.printStats = function() {
  var services = _.groupBy(stats, 'name');
  var result = _.mapObject(services, function(val, key) {
    var durations = _.map(val, function(item) {
      return item.endTime - item.startTime;
    });

    return {
      max: _.max(durations),
      avg: avg(durations),
      count: durations.length
    };
  });

  console.table(result);
  return result;
};

module.exports = stats;
