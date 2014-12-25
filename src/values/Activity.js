var _ = require('underscore');
var moment = require('moment');
var IList = require('immutable').List;
var merge = require('app/utils').merge;
var hashCode = require('app/utils').hashCode;
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

Activity.prototype.weeks = function () {
  var dateByWeek = this.items.groupBy(v => v.date.week());

  var unorderedWeeks = dateByWeek.map(function(items, key) {
    var n = Number(key);

    return {
      number: n,
      month: moment().week(n).month(),
      items: items.sortBy(v => v.date.day())
    };
  });

  return unorderedWeeks.sortBy((v) => v.number);
};

Activity.prototype.months = function () {
  var dateByMonth = this.items.groupBy(v => v.date.month());

  var ms = dateByMonth.map(function (days, key) {
    return {
      number: Number(key),
      days: days
    };
  });

  return ms.map(function (item, i) {
    return _.extend(item, {
      weeksN: i > 0 ? Math.floor(item.days.size / 7) : Math.ceil(item.days.size / 7)
    });
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
