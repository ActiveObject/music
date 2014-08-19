var React = require('react');
var _ = require('underscore');
var Color = require('color');
var curry = require('curry');
var Activity = require('app/models/activity');

var dom = React.DOM;
var div = React.DOM.div;
var rect = React.DOM.rect;
var svg = React.DOM.svg;
var g = React.DOM.g;

module.exports = React.createClass({
  displayName: 'ActivityCard',

  getDefaultProps: function() {
    return {
      size: 18,
      margin: 1,
      defaultColor: '#F5F5F5'
    };
  },

  render: function() {
    var dateRange = Activity.makeDateRange(new Date(), 184);
    var activity = Activity.fillEmptyDates(dateRange, this.props.activity);
    var achart = this.makeActivityChart(this.props.size, this.props.margin, activity, this.props.defaultColor);
    var name = dom.a({ key: 'name', className: 'activity-name', href: '/groups/' + this.props.id }, this.props.name);

    return div({
      className: 'activity'
    }, [name, achart]);
  },

  makeActivityChart: function(size, margin, activity, defaultColor) {
    var weeks = Activity.weeks(activity);
    var maxNewsCount = Math.max.apply(null, _.pluck(activity, 'news'));
    var items = weeks.map(this.makeWeek(maxNewsCount, size, margin, defaultColor));

    return div({
      key: 'chart',
      className: 'activity-chart'
    }, svg({
      width: (size + margin) * weeks.length,
      height: (size + margin) * 7
    }, items));
  },

  makeWeek: curry(function(maxValue, size, margin, defaultColor, week, i) {
    var items = week.items.map(function(item, i) {
      return rect({
        key: i,
        width: size,
        height: size,
        y: i * (size + margin),
        fill: item.news > 0 ? makeFillColor(item.news, maxValue) : defaultColor
      });
    });

    return g({
      key: week.number,
      transform: 'translate(' + [(size + margin) * i, 0].join(',') + ')'
    }, items);
  })
});

function makeFillColor(count, maxValue) {
  return Color('#3366CC').lighten(1 - count / maxValue).rgbString();
}
