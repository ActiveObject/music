var React = require('react');
var moment = require('moment');
var classnames = require('classnames');

var ActivityChart = React.createClass({
  propTypes: {
    size: React.PropTypes.number,
    margin: React.PropTypes.number,
    activity: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      size: 16,
      margin: 2
    };
  },

  render: function () {
    var achart = this.makeActivityChart(this.props.size, this.props.margin, this.props.activity);

    var weekdays = (
      <div
        key='weekdays'
        className='activity-chart-weekdays'
        style={{ width: this.props.size }} >{[1, 3, 5].map(this.makeWeekday)}</div>
    );

    var months = this.makeMonthLegend(this.props.activity);

    return (
      <div key='content' className='activity-chart-content'>
        {achart}
        {weekdays}
        {months}
      </div>
    );
  },

  makeActivityChart: function(size, margin, activity) {
    var dowSlices = [0, 1, 2, 3, 4, 5, 6].map(function (dow) {
      var items = activity.sliceForDayOfWeek(dow).map(function (item, i) {
        return (
          <rect
            key={item.date.toISOString()}
            width={size}
            height={size}
            x={i * (size + margin)}
            y={0}
            className={makeFillColor(item.news)} />
        );
      });

      return (
        <g key={dow} transform={'translate(' + [0, (size + margin) * dow].join(',') + ')'} >
          {items}
        </g>
      )
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
      var cx = classnames({
        'activity-chart-month': true,
        'activity-chart-month-hidden': v.size < 3
      });

      var monthStyle = {
        width: v.size * (this.props.size + this.props.margin)
      };

      return (
        <div key={v.year + ':' + v.month} className={cx} style={monthStyle} >
          {moment.monthsShort(v.month)}
        </div>
      );
    }, this);

    return <div key='months' className='activity-chart-months'>{months}</div>;
  },

  makeWeekday: function (n) {
    var weekdayStyle = {
      height: this.props.size,
      top: (this.props.size + this.props.margin) * n,
      lineHeight: this.props.size + 'px'
    };

    return (
      <div className='activity-chart-weekday' key={n} style={weekdayStyle} >
        {moment.weekdaysMin(n).slice(0, 1)}
      </div>
    );
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

module.exports = ActivityChart;
