require('app/styles/activity-card.styl');
require('app/styles/element.styl');

var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var curry = require('curry');
var Activity = require('app/values/activity');

var dom = require('app/core/dom');

var ActivityCard = React.createClass({
  getDefaultProps: function() {
    return {
      size: 16,
      margin: 2
    };
  },

  shouldComponentUpdate: function(nextProps) {
    return nextProps.id !== this.props.id ||
      nextProps.size !== this.props.size ||
      nextProps.margin !== this.props.margin ||
      nextProps.name !== this.props.name ||
      nextProps.activity !== this.props.activity;
  },

  render: function() {
    var achart = this.makeActivityChart(this.props.size, this.props.margin, this.props.activity);

    var weekdays = dom.div()
      .key('weekdays')
      .className('activity-card-weekdays')
      .attr('style', { left: -(this.props.size + this.props.margin), width: this.props.size })
      .append([1, 3, 5].map(this.makeWeekday))
      .make();

    var months = this.makeMonthLegend(this.props.activity).make();

    return (
      <div className='activity'>
        <a key='name' className='element-link activity-name' href={'/groups/' + this.props.id}>{this.props.name}</a>
        <div key='content' className='activity-chart-content'>
          {achart}
          {weekdays}
          {months}
        </div>
      </div>
    );
  },

  makeActivityChart: function(size, margin, activity) {
    var weeks = activity.weeks();
    var maxNewsCount = Math.max.apply(null, _.pluck(activity.items, 'news'));

    return (
      <div key='chart' className='activity-chart'>
        <svg width={(size + margin) * weeks.length} height={(size + margin) * 7}>
          {weeks.map(this.makeWeek(maxNewsCount, size, margin))}
        </svg>
      </div>
    );
  },

  makeMonthLegend: function (activity) {
    var months = activity.months().map(function (m) {
      return dom.div()
        .key(m.number)
        .className('activity-card-month')
        .attr('style', { width: m.weeksN * (this.props.size + this.props.margin) })
        .append(moment.monthsShort(m.number));
    }, this);

    return dom.div()
      .key('months')
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
      .append(items)
      .make();
  }),

  makeWeekday: function (n) {
    return dom.div()
      .key(n)
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

module.exports = ActivityCard;
