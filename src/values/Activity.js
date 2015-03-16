var _ = require('underscore');
var IList = require('immutable').List;
var merge = require('app/utils/merge');
var hashCode = require('app/utils/hashCode');
var ActivityItem = require('app/values/activity-item');
var week = require('app/utils/week');
var weekday = require('app/utils/weekday');

function Activity(owner, period, activities) {
  console.time('activity');
  var items = _.chain(activities.toArray())
    .groupBy(a => a.date)
    .mapObject((v, k) => new ActivityItem(new Date(k), v.length))
    .values()
    .value();

  this.owner = owner;
  this.items = IList(_.sortBy(period.fillEmptyDates(items), 'date'));
  console.timeEnd('activity');
}

Activity.prototype.totalWeeks = function () {
  var t = {};
  this.items.forEach(v => t[week(v.date)] = 1);
  return Object.keys(t).length;
};

Activity.prototype.sliceForDayOfWeek = function (day) {
  return this.items.filter(v => weekday(v.date) === day);
};

Activity.prototype.months = function () {
  var dateByMonth = this.sliceForDayOfWeek(0)
    .groupBy(v => v.date.getFullYear() + ':' + (v.date.getMonth() + 1));

  return dateByMonth.map(function (days, key) {
    var [year, month] = key.split(':').map(Number);

    return {
      year: year,
      month: month,
      size: days.size
    };
  }).sort(function (a, b) {
    if (a.year - b.year === 0) {
      return a.month - b.month;
    }

    return a.year - b.year;
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
