var _ = require('underscore');
var moment = require('moment');
var curry = require('curry');
var ISet = require('immutable').Set;
var merge = require('app/utils').merge;
var hashCode = require('app/utils').hashCode;
var combineHash = require('app/utils').combineHash;
var LastNWeeksDRange = require('app/values/last-nweeks-drange');
var ActivityItem = require('app/values/activity-item');

function Activity(attrs) {
  this.items = attrs.items;
  this.owner = attrs.owner;
}

Activity.prototype.hashCode = function () {
  return this.items.hashCode();
};

Activity.prototype.equals = function (other) {
  return this.owner === other.owner && this.items.equals(other.items);
};

Activity.prototype.fromNewsfeed = function(nf) {
  var itemsByDate = nf.posts.groupBy(function (post) {
    return moment(post.date).format('YYYY-MM-DD');
  });

  var activity = itemsByDate.map(function (values, date) {
    return new ActivityItem(moment(date), values.size);
  });

  return this.modify({ items: ISet(activity.values()) });
};

Activity.prototype.merge = function (other) {
  return this.modify({
    items: this.items.union(other.items)
  });
};

Activity.prototype.forPeriod = function(period) {
  return this.modify({
    items: period.fillEmptyDates(this.items)
  });
};

Activity.prototype.load = function (offset, count) {
  return {
    e: 'vk',
    a: ':vk/activity-request',
    v: {
      owner: this.owner,
      offset: offset,
      count: count
    }
  };
};

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

Activity.prototype.modify = function (attrs) {
  return new Activity(merge(this, attrs));
};

module.exports = new Activity({
  items: ISet(),
  owner: 0
});

