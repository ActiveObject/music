var _ = require('underscore');
var moment = require('moment');
var curry = require('curry');
var merge = require('app/utils').merge;
var hashCode = require('app/utils').hashCode;
var combineHash = require('app/utils').combineHash;
var LastNWeeksDRange = require('app/values/last-nweeks-drange');
var ActivityItem = require('app/values/activity-item');

function Activity(attrs) {
  this.period = attrs.period;
  this.items = attrs.items;
  this.owner = attrs.owner;
}

Activity.prototype.hashCode = function () {
  return this.items.reduce(combineHash, 1);
};

Activity.prototype.equals = function (other) {
  return this.period.equals(other.period) &&
    this.owner === other.owner &&
    this.items.every(function (item, i) {
      return item.equals(other.items[i]);
    });
};

Activity.prototype.fromNewsfeed = function(nf) {
  var itemsByDate = nf.posts.groupBy(function (post) {
    return moment(post.date).format('YYYY-MM-DD');
  });

  var activity = itemsByDate.map(function (values, date) {
    return new ActivityItem(date, values.size);
  });

  return this.modify({ items: activity.toArray() });
};

Activity.prototype.merge = function (other) {
  // return new Activity({
  //   period: this.period,
  //   items: this.items.concat(other.items),
  //   owner: this.owner
  // });

  return other;
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
  var dateByWeek = _.groupBy(this.items, function (item) {
    return item.date.week();
  });

  var unorderedWeeks = _.map(dateByWeek, function(items, key) {
    var n = Number(key);

    return {
      number: n,
      month: moment().week(n).month(),
      items: _.sortBy(items, function (item) {
        return item.date.day();
      })
    };
  });

  return _.sortBy(unorderedWeeks, 'number');
};

Activity.prototype.months = function () {
  var dateByMonth = _.groupBy(this.items, item => item.date.month());

  var ms = _.map(dateByMonth, function (days, key) {
    return {
      number: Number(key),
      days: days
    };
  });

  return ms.map(function (item, i) {
    return _.extend(item, {
      weeksN: i > 0 ? Math.floor(item.days.length / 7) : Math.ceil(item.days.length / 7)
    });
  });
};

Activity.prototype.modify = function (attrs) {
  return new Activity(merge(this, attrs));
};

module.exports = new Activity({
  period: new LastNWeeksDRange(33, new Date()),
  items: [],
  owner: 0
});

