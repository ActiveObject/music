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
    var dowSlices = [0, 1, 2, 3, 4, 5, 6].map(function (dow) {
      var items = activity.sliceForDayOfWeek(dow).map(function (item, i) {
        return dom.rect()
          .key(item.date.format('YYYY-MM-DD'))
          .attr('width', size)
          .attr('height', size)
          .attr('x', i * (size + margin))
          .attr('y', 0)
          .attr('className', makeFillColor(item.news));
      });

      return dom.g()
        .key(dow)
        .attr('transform', 'translate(' + [0, (size + margin) * dow].join(',') + ')')
        .append(items.toArray())
        .make();
    });

    return (
      <div key='chart' className='activity-chart'>
        <svg width={(size + margin) * activity.totalWeeks()} height={(size + margin) * 7}>
          {dowSlices}
        </svg>
      </div>
    );
  },

  makeMonthLegend: function (activity) {
    var months = activity.months().map(function (v) {
      return dom.div()
        .key(v.year + ':' + v.month)
        .className('activity-card-month')
        .className('activity-card-month-hidden', v.size < 3)
        .attr('style', { width: v.size * (this.props.size + this.props.margin) })
        .append(moment.monthsShort(v.month));
    }, this);

    return dom.div()
      .key('months')
      .className('activity-card-months')
      .append(months.toArray());
  },

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