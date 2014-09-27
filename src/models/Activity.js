var _ = require('underscore');
var moment = require('moment');
var curry = require('curry');

function makeDateRange(today, amout) {
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
    var found = _.find(activityDates, item => doy === item.doy);

    return {
      date: d,
      news: found ? found.news : 0
    };
  });
}

function weeks(activity) {
  var dateByWeek = _.groupBy(activity, item => item.date.week());

  var unorderedWeeks = _.map(dateByWeek, function(items, key) {
    return {
      number: Number(key),
      items: _.sortBy(items, item => item.date.day())
    };
  });

  return _.sortBy(unorderedWeeks, 'number');
}

exports.makeDateRange = makeDateRange;
exports.fillEmptyDates = fillEmptyDates;
exports.weeks = weeks;