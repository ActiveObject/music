var LastNWeeksDRange = require('app/values/last-nweeks-drange');

exports.fromJSON = function (v) {
  if (v['last-nweeks']) {
    return LastNWeeksDRange.fromJSON(v['last-nweeks']);
  }

  throw new TypeError('Unknown date range type: ' + Object.keys(v) + '. Available types: [last-nweeks]');
};