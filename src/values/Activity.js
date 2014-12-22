var _ = require('underscore');
var moment = require('moment');
var curry = require('curry');
var merge = require('app/utils').merge;
var LastNWeeksDRange = require('app/values/last-nweeks-drange');

function Activity(attrs) {
  this.items = attrs.items;
  this.owner = attrs.owner;
  this.period = attrs.period;
}

Activity.prototype.fromNewsfeed = function(nf) {
  var itemsByDate = nf.posts.groupBy(function (post) {
    return moment(post.date).format('YYYY-MM-DD');
  });

  var activity = itemsByDate.map(function (values, date) {
    return {
      date: date,
      news: values.size
    };
  }).toArray();

  return new Activity({
    owner: this.owner,
    items: this.period.fillEmptyDates(activity)
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

// exports.update = update;
module.exports = new Activity({
  period: new LastNWeeksDRange(33),
  items: [],
  owner: 0
});

