var _ = require('underscore');
var moment = require('moment');
var curry = require('curry');
var merge = require('app/utils').merge;

function NewsfeedActivity(attrs) {
  this.newsfeed = attrs.newsfeed;
  this.activity = attrs.activity;
}

NewsfeedActivity.prototype.load = function() {
  return this.newsfeed.load(0, 800);
};

NewsfeedActivity.prototype.forPeriod = function(daterange) {
  return this.modify({
    activity: daterange.fillEmptyDates(this.activity)
  });
};

NewsfeedActivity.prototype.modify = function(attrs) {
  return new NewsfeedActivity(merge(this, attrs));
};

function IndexedActivity(attrs) {
  this.total = attrs.total;
  this.indexed = attrs.indexed;
  this.activity = attrs.activity;
}

IndexedActivity.prototype.fromNewsfeed = function(nf) {
  var itemsByDate = nf.posts.groupBy(function (post) {
    return moment(post.date).format('YYYY-MM-DD');
  });

  var activity = itemsByDate.map(function (values, date) {
    return {
      date: date,
      news: values.size
    };
  }).toArray();

  return new NewsfeedActivity({
    newsfeed: nf,
    activity: activity
  });
};

function weeks(activity) {
  var dateByWeek = _.groupBy(activity, function (item) {
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
}

function months(activity) {
  var dateByMonth = _.groupBy(activity, item => item.date.month());

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
}

function update(posts, activity) {
  if (posts.total === activity.total) {
    return activity;
  }

  var toIndex = posts.items.filter(function (post) {
    return !_.contains(activity.indexed, post.id);
  });

  var itemsByDate = _.groupBy(toIndex, function (post) {
    return moment(post.date).format('YYYY-MM-DD');
  });

  var items = _.map(itemsByDate, function (values, date) {
    return {
      date: date,
      news: values.length
    };
  });

  return new IndexedActivity({
    total: posts.total,
    indexed: activity.indexed.concat(toIndex.map(function (post) { return post.id; })),
    activity: activity.activity.concat(items)
  });
}

// exports.update = update;
module.exports = new IndexedActivity({
  total: 0,
  indexed: [],
  activity: []
});

module.exports.weeks = weeks;
module.exports.months = months;

