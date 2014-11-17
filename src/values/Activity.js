var _ = require('underscore');
var moment = require('moment');
var curry = require('curry');

function Activity(data) {
  if (!(this instanceof Activity)) {
    return new Activity(data);
  }

  this.total = data.total;
  this.indexed = data.indexed;
  this.items = data.items;
}

function makeDateRange(today, options) {
  var weeks = options.weeks;
  var amout = moment(today).day() + (weeks - 1) * 7 + 1;
  var dates = [];

  for (var i = 0; i < amout; i++) {
    dates.push(moment(today).subtract(i, 'days'));
  }

  return dates;
}

function fillEmptyDates(range, activity) {
  var activityDates = activity.map(function (item) {
    return {
      doy: moment(item.date).dayOfYear(),
      news: item.news
    };
  });

  return range.map(function(d) {
    var doy = d.dayOfYear();
    var found = _.find(activityDates, function (item) {
      return doy === item.doy;
    });

    return {
      date: d,
      news: found ? found.news : 0
    };
  });
}

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
  var dateByMonth = _.groupBy(activity, function (item) {
    return item.date.month();
  });

  var months = _.map(dateByMonth, function (days, key) {
    return {
      number: Number(key),
      days: days
    };
  });

  return months.map(function (item, i) {
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

  return new Activity({
    total: posts.total,
    indexed: activity.indexed.concat(toIndex.map(function (post) { return post.id; })),
    items: activity.items.concat(items)
  });
}

exports.makeDateRange = makeDateRange;
exports.fillEmptyDates = fillEmptyDates;
exports.weeks = weeks;
exports.months = months;
exports.update = update;

exports.empty = new Activity({
  total: 0,
  indexed: [],
  items: []
});