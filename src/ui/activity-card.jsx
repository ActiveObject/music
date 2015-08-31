require('app/styles/activity-card.styl');
require('app/styles/element.styl');

var React = require('react/addons');
var ActivityChart = require('app/ui/activity-chart');
var vbus = require('app/core/vbus');
var LastNWeeksDRange = require('app/values/last-nweeks-drange');

var ActivityCard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render: function() {
    var href = `/groups/${this.props.id}`;

    return (
      <div className='activity'>
        <a className='element-link activity-name' href={href} onClick={this.goToGroup}>{this.props.name}</a>
        <ActivityChart activity={this.props.activity} />
      </div>
    );
  },

  goToGroup: function(e) {
    e.preventDefault();
    vbus.emit({
      tag: [':app/route', ':route/group'],
      id: this.props.id,
      period: new LastNWeeksDRange(32, new Date())
    });
  }
});

module.exports = ActivityCard;
