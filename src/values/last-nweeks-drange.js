var hashCode = require('app/utils/hashCode');
var dayOfYear = require('app/utils/dayOfYear');
var ActivityItem = require('app/values/activity-item');

var dayms = 24 * 60 * 60 * 1000;

function LastNWeeksDRange(n, today) {
  var dates = [];
  var todayTimestamp = today.valueOf();
  var totalDays = n * 7 - (7 - today.getDay() - 1);

  for (var i = 0; i < totalDays; i++) {
    dates.push(new Date(todayTimestamp - i * dayms));
  }

  this.n = n;
  this.today = today;
  this.dates = dates;
}

LastNWeeksDRange.fromJSON = function (v) {
  return new LastNWeeksDRange(v, new Date());
};

LastNWeeksDRange.prototype.toJSON = function () {
  return {
    'last-nweeks': this.n
  };
};

LastNWeeksDRange.prototype.tag = function () {
  return 'last-nweeks-drange';
};

LastNWeeksDRange.prototype.rep = function () {
  return this.n;
};

LastNWeeksDRange.prototype.fillEmptyDates = function(activity) {
  var activityDates = Object.create(null);

  activity.forEach(function (v) {
    activityDates[dayOfYear(v.date)] = v.news;
  });

  return this.dates.map(function(d) {
    return new ActivityItem(d, activityDates[dayOfYear(d)] || 0);
  });
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
