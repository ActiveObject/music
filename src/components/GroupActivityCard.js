var React = require('react');
var moment = require('moment');
var _ = require('underscore');
var Color = require('color');
var curry = require('curry');

var div = React.DOM.div;
var rect = React.DOM.rect;
var svg = React.DOM.svg;
var g = React.DOM.g;

module.exports = React.createClass({
  getDefaultProps: function() {
    return {
      size: 18,
      margin: 2
    };
  },

  render: function() {
    var activity = fillEmptyDates(makeDateRange(new Date(), 185), this.props.activity);
    var achart = makeActivityChart(this.props.size, this.props.margin, activity);
    var name = div({ className: 'group-activity-name' }, this.props.name);
    return div({ className: 'group-activity' }, [name, achart]);
  }
});

var makeActivityChart = curry(function(size, margin, activity) {
  var weeks = _.groupBy(activity, function(item) {
    return item.date.week();
  });

  var weeks = _.map(weeks, function(items, key) {
    return {
      week: Number(key),
      items: _.sortBy(items, function(item) {
        return item.date.day();
      })
    };
  });

  var weeks = _.sortBy(weeks, 'week');
  var maxNewsCount = Math.max.apply(null, _.pluck(activity, 'news'));
  var items = weeks.map(makeWeek(maxNewsCount, size, margin));
  return div({ className: 'group-activity-chart' }, svg({
    width: (size + margin) * weeks.length,
    height: (size + margin) * 7
  }, items));
});

var makeWeek = curry(function(maxValue, size, margin, week, i) {
  var items = week.items.map(function(item, i) {
    return rect({
      width: size,
      height: size,
      y: i * (size + margin),
      fill: item.news > 0 ? Color('#3366CC').lighten(1 - item.news / maxValue).rgbString() : '#F5F5F5'
    });
  });

  return g({
    transform: 'translate(' + [(size + margin) * i, 0].join(',') + ')'
  }, items);
});

var makeDateRange = function(today, amout) {
  var dates = [];

  for (var i = 0; i < amout; i++) {
    dates.push(moment(today).subtract(i, 'days'));
  }

  return dates;
};

var fillEmptyDates = curry(function(range, activity) {
  return range.map(function(d) {
    var found = _.find(activity, function(item) {
      return d.dayOfYear() === moment(item.date).dayOfYear()
    });

    return {
      date: d,
      news: found ? found.news : 0
    };
  });
});