var React = require('react');
var _ = require('underscore');
var Color = require('color');
var curry = require('curry');
var Activity = require('app/models/activity');

var div = React.DOM.div;
var rect = React.DOM.rect;
var svg = React.DOM.svg;
var g = React.DOM.g;

module.exports = React.createClass({
  displayName: 'ActivityCard',

  getDefaultProps: function() {
    return {
      size: 18,
      margin: 2
    };
  },

  render: function() {
    var dateRange = Activity.makeDateRange(new Date(), 30);
    var activity = Activity.fillEmptyDates(dateRange, this.props.activity);
    var achart = this.makeActivityChart(this.props.size, this.props.margin, activity);
    var name = div({ key: 'name', className: 'activity-name' }, this.props.name);

    return div({
      className: 'activity'
    }, [name, achart]);
  },

  makeActivityChart: function(size, margin, activity) {
    var weeks = Activity.weeks(activity);
    var maxNewsCount = Math.max.apply(null, _.pluck(activity, 'news'));
    var items = weeks.map(this.makeWeek(maxNewsCount, size, margin));

    return div({
      key: 'chart',
      className: 'activity-chart'
    }, svg({
      width: (size + margin) * weeks.length,
      height: (size + margin) * 7
    }, items));
  },

  makeWeek: curry(function(maxValue, size, margin, week, i) {
    var items = week.items.map(function(item, i) {
      return rect({
        key: i,
        width: size,
        height: size,
        y: i * (size + margin),
        fill: item.news > 0 ? Color('#3366CC').lighten(1 - item.news / maxValue).rgbString() : '#F5F5F5'
      });
    });

    return g({
      key: week.number,
      transform: 'translate(' + [(size + margin) * i, 0].join(',') + ')'
    }, items);
  })
});
