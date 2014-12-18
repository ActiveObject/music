var _ = require('underscore');
var List = require('immutable').List;
var merge = require('app/utils').merge;
var post = require('app/values/post');
var activity = require('app/values/activity');
var moment = require('moment');

function LastNWeeks(n, today) {
  var amout = moment(today).day() + (n - 1) * 7 + 1;
  var dates = [];

  for (var i = 0; i < amout; i++) {
    dates.push(moment(today).subtract(i, 'days'));
  }

  this.n = n;
  this.today = today;
  this.dates = dates;
}

LastNWeeks.prototype.fillEmptyDates = function(activity) {
  var activityDates = activity.map(function (item) {
    return {
      doy: moment(item.date).dayOfYear(),
      news: item.news
    };
  });

  return this.dates.map(function(d) {
    var doy = d.dayOfYear();
    var found = _.find(activityDates, function (item) {
      return doy === item.doy;
    });

    return {
      date: d,
      news: found ? found.news : 0
    };
  });
};

function Newsfeed(attrs) {
  this.owner = attrs.owner;
  this.posts = attrs.posts;
  this.total = attrs.total;
}

Newsfeed.prototype.lastNWeeksActivity = function(n) {
  return activity.fromNewsfeed(this).forPeriod(new LastNWeeks(n, new Date()));
};

Newsfeed.prototype.modify = function(attrs) {
  return new Newsfeed(merge(this, attrs));
};

Newsfeed.prototype.fromVkResponse = function(res) {
  return this.modify({
    owner: res.owner,
    total: res.count,
    posts: new List(res.items.map(function(attrs) {
      return post.modify(attrs);
    }))
  });
};

Newsfeed.prototype.merge = function(otherNf) {
  return new Newsfeed({
    posts: this.posts.toSet().union(otherNf.posts.toSet()).toList(),
    total: Math.max(this.total, otherNf.total)
  });
};

Newsfeed.prototype.load = function(offset, count) {
  return {
    e: 'vk',
    a: ':vk/wall-request',
    v: {
      owner: this.owner,
      offset: offset,
      count: count
    }
  };
};

module.exports = new Newsfeed({
  posts: new List(),
  total: 0,
  owner: 0
});
