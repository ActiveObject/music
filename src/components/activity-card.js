require('app/styles/activity-card.styl');

var React = require('react');
var _ = require('underscore');
var curry = require('curry');
var Activity = require('app/models/activity');

var dom = require('app/core/dom');

module.exports = React.createClass({
  displayName: 'ActivityCard',

  getDefaultProps: function() {
    return {
      size: 16,
      margin: 2
    };
  },

  render: function() {
    var dateRange = Activity.makeDateRange(new Date(), { weeks: 33 });
    var activity = Activity.fillEmptyDates(dateRange, this.props.activity.items);
    var achart = this.makeActivityChart(this.props.size, this.props.margin, activity);

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

  makeActivityChart: function(size, margin, activity) {
    var weeks = Activity.weeks(activity);
    var maxNewsCount = Math.max.apply(null, _.pluck(activity, 'news'));
    var items = weeks.map(this.makeWeek(maxNewsCount, size, margin));

    var body = dom.svg()
      .attr('width', (size + margin) * weeks.length)
      .attr('height', (size + margin) * 7)
      .append(items);

    return dom.div()
      .key('chart')
      .className('activity-chart')
      .append(body);
  },

  makeWeek: curry(function(maxValue, size, margin, week, i) {
    var items = week.items.map(function(item, i) {
      return dom.rect()
        .key(i)
        .attr('width', size)
        .attr('height', size)
        .attr('y', i * (size + margin))
        .attr('className', makeFillColor(item.news));
    });

    return dom.g()
      .key(week.number)
      .attr('transform', 'translate(' + [(size + margin) * i, 0].join(',') + ')')
      .append(items);
  })
});

function makeFillColor(count) {
  var base = 'activity-item-';

  if (count === 0) {
    return base + '0';
  }

  if (count > 0 && count <= 3) {
    return base + '1';
  }

  if (count > 3 && count <= 5) {
    return base + '2';
  }

  if (count > 5 && count <= 15) {
    return base + '3';
  }

  return base + '4';
}
