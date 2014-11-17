require('app/styles/activity-card.styl');

var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var curry = require('curry');
var Activity = require('app/values/activity');

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
    var months = this.makeMonthLegend(activity);

    var name = dom.a()
      .key('name')
      .className('activity-name')
      .attr('href', '/groups/' + this.props.id )
      .append(this.props.name);

    var tu = this.makeWeekday(1);
    var th = this.makeWeekday(3);
    var sa = this.makeWeekday(5);

    var weekdays = dom.div()
      .className('activity-card-weekdays')
      .attr('style', { left: -(this.props.size + this.props.margin), width: this.props.size })
      .append(tu, th, sa);

    var content = dom.div()
      .className('activity-chart-content')
      .append(achart, weekdays, months);

    return dom.div()
      .className('activity')
      .append(name, content)
      .make();
  },

  makeActivityChart: function(size, margin, activity) {
    var weeks = Activity.weeks(activity);
    var maxNewsCount = Math.max.apply(null, _.pluck(activity, 'news'));
    var items = weeks.map(this.makeWeek(maxNewsCount, size, margin));
    var months = Activity.months(activity);

    var body = dom.svg()
      .attr('width', (size + margin) * weeks.length)
      .attr('height', (size + margin) * 7)
      .append(items);

    return dom.div()
      .key('chart')
      .className('activity-chart')
      .append(body);
  },

  makeMonthLegend: function (activity) {
    var months = Activity.months(activity).map(function (m) {
      return dom.div()
        .className('activity-card-month')
        .attr('style', { width: m.weeksN * (this.props.size + this.props.margin) })
        .append(moment.monthsShort(m.number))
    }, this);

    return dom.div()
      .className('activity-card-months')
      .append(months);
  },

  makeWeek: curry(function(maxValue, size, margin, week, i) {
    var items = week.items.map(function(item, i) {
      return dom.rect()
        .key(i)
        .attr('width', size)
        .attr('height', size)
        .attr('y', i * (size + margin))
        .attr('className', makeFillColor(item.news))
        .attr('title', item.date.toISOString());
    });

    return dom.g()
      .key(week.number)
      .attr('transform', 'translate(' + [(size + margin) * i, 0].join(',') + ')')
      .append(items);
  }),

  makeWeekday: function (n) {
    return dom.div()
      .className('activity-card-weekday')
      .attr('style', {
        height: this.props.size,
        top: (this.props.size + this.props.margin) * n,
        lineHeight: this.props.size + 'px'
      })
      .append(moment.weekdaysMin(n).slice(0, 1));
  }
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
