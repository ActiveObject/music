var _ = require('underscore');
var moment = require('moment');
var IList = require('immutable').List;
var merge = require('app/utils/merge');
var hashCode = require('app/utils/hashCode');
var LastNWeeksDRange = require('app/values/last-nweeks-drange');
var ActivityItem = require('app/values/activity-item');

function Activity(owner, period, activities) {
  var items = _.chain(activities.toArray())
    .filter(a => a.owner === owner)
    .groupBy(a => a.date)
    .mapObject((v, k) => new ActivityItem(new Date(k), v.length))
    .values()
    .value();

  this.owner = owner;
  this.items = IList(_.sortBy(period.fillEmptyDates(items), 'date'));
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
