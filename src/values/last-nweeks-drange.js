var _ = require('underscore');
var moment = require('moment');

function LastNWeeksDRange(n, today) {
  var amout = moment(today).day() + (n - 1) * 7 + 1;
  var dates = [];

  for (var i = 0; i < amout; i++) {
    dates.push(moment(today).subtract(i, 'days'));
  }

  this.n = n;
  this.today = today;
  this.dates = dates;
}

LastNWeeksDRange.prototype.fillEmptyDates = function(activity) {
  var activityDates = activity.map(function (item) {
    return {
      doy: moment(item.date).dayOfYear(),
      news: item.news
    };
  });

  return this.dates.map(function(d) {
    var doy = d.dayOfYear();
    var found = _.find(activityDates, function (item) {
      return doy === item.doy;
    });

    return {
      date: d,
      news: found ? found.news : 0
    };
  });
};

module.exports = LastNWeeksDRange;
