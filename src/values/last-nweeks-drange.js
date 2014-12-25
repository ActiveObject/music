var _ = require('underscore');
var moment = require('moment');
var ISet = require('immutable').Set;
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
  var activityDates = activity.map(function (v) {
    return {
      doy: moment(v.date).dayOfYear(),
      news: v.news
    };
  });

  var dates = this.dates.map(function(d) {
    var doy = d.dayOfYear();
    var found = activityDates.find(v => doy === v.doy);

    return new ActivityItem(d, found ? found.news : 0);
  });

  return ISet(dates);
};

LastNWeeksDRange.prototype.startOf = function () {
  return this.dates[this.dates.length - 1];
};

LastNWeeksDRange.prototype.endOf = function () {
  return this.dates[0];
};

LastNWeeksDRange.prototype.hashCode = function () {
  return 31 * hashCode(this.n) + 31 * hashCode(this.date.valueOf());
};

LastNWeeksDRange.prototype.equals = function (other) {
  return this.n === other.n && this.today.valueOf() === other.today.valueOf();
};

LastNWeeksDRange.prototype.toString = function() {
  return 'LastNWeeksDRange(' + this.n + ', ' + this.today.toISOString() + ')';
};

module.exports = LastNWeeksDRange;
