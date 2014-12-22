var _ = require('underscore');
var moment = require('moment');
var hashCode = require('app/utils').hashCode;
var ActivityItem = require('app/values/activity-item');

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

    return new ActivityItem(d, found ? found.news : 0);
  });
};

LastNWeeksDRange.prototype.hashCode = function () {
  return 31 * hashCode(this.n) + 31 * hashCode(this.date.valueOf());
};

LastNWeeksDRange.prototype.equals = function (other) {
  return this.n === other.n && this.today.valueOf() === other.today.valueOf();
};

module.exports = LastNWeeksDRange;
