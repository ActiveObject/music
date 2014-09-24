require('app/styles/activity-card.styl');

var React = require('react');
var _ = require('underscore');
var Color = require('color');
var curry = require('curry');
var Activity = require('app/models/activity');

var dom = require('app/core/dom');

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
    var dateRange = Activity.makeDateRange(new Date(), 185);
    var activity = Activity.fillEmptyDates(dateRange, this.props.activity);
    var achart = this.makeActivityChart(this.props.size, this.props.margin, activity, this.props.defaultColor);

    var name = dom.a()
      .key('name')
      .className('activity-name')
      .attr('href', '/groups/' + this.props.id )
      .append(this.props.name);

    return dom.div()
      .className('activity')
      .append(name, achart)
      .make();
  },

  makeActivityChart: function(size, margin, activity, defaultColor) {
    var weeks = Activity.weeks(activity);
    var maxNewsCount = Math.max.apply(null, _.pluck(activity, 'news'));
    var items = weeks.map(this.makeWeek(maxNewsCount, size, margin, defaultColor));

    var body = dom.svg()
      .attr('width', (size + margin) * weeks.length)
      .attr('height', (size + margin) * 7)
      .append(items);

    return dom.div()
      .key('chart')
      .className('activity-chart')
      .append(body);
  },

  makeWeek: curry(function(maxValue, size, margin, defaultColor, week, i) {
    var items = week.items.map(function(item, i) {
      return dom.rect()
        .key(i)
        .attr('width', size)
        .attr('height', size)
        .attr('y', i * (size + margin))
        .attr('fill', item.news > 0 ? makeFillColor(item.news, maxValue) : defaultColor);
    });

    return dom.g()
      .key(week.number)
      .attr('transform', 'translate(' + [(size + margin) * i, 0].join(',') + ')')
      .append(items);
  })
});

function makeFillColor(count, maxValue) {
  return Color('#3366CC').lighten(1 - count / maxValue).rgbString();
}
