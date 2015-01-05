var _ = require('underscore');
var moment = require('moment');
var IList = require('immutable').List;
var merge = require('app/utils/merge');
var hashCode = require('app/utils/hashCode');
var LastNWeeksDRange = require('app/values/last-nweeks-drange');
var ActivityItem = require('app/values/activity-item');

function Activity(owner, period, activities) {
  var items = activities
    .filter(a => a.owner === owner)
    .groupBy(a => a.date)
    .map(v => v.size)
    .map((v, k) => new ActivityItem(moment(k), v));

  this.owner = owner;
  this.items = IList(period.fillEmptyDates(items).sortBy(v => v.date).values());
}

Activity.prototype.totalWeeks = function () {
  return this.items.groupBy(v => v.date.week()).size;
};

Activity.prototype.sliceForDayOfWeek = function (day) {
  return this.items.filter(v => v.date.weekday() === day);
};

Activity.prototype.months = function () {
  var dateByMonth = this.sliceForDayOfWeek(0)
    .groupBy(v => v.date.year() + ':' + v.date.month());

  return dateByMonth.map(function (days, key) {
    var [year, month] = key.split(':').map(Number);

    return {
      year: year,
      month: month,
      size: days.size
    };
  }).sort(function (a, b) {
    return (a.year + a.month) - (b.year + b.month);
  });
};

Activity.prototype.hashCode = function () {
  return this.items.hashCode();
};

Activity.prototype.equals = function (other) {
  return this.items.equals(other.items);
};

Activity.prototype.toString = function() {
  return 'Activity(' + this.owner + ')';
};

Activity.prototype.modify = function (attrs) {
  return new Activity(merge(this, attrs));
};

module.exports = Activity;
