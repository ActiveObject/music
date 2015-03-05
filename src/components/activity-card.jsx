require('app/styles/activity-card.styl');
require('app/styles/element.styl');

var React = require('react/addons');
var ActivityChart = require('app/components/activity-chart');

var ActivityCard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render: function() {
    return (
      <div className='activity'>
        <a key='name' className='element-link activity-name' href={'/groups/' + this.props.id}>{this.props.name}</a>
        <ActivityChart activity={this.props.activity} />
      </div>
    );
  }
});

module.exports = ActivityCard;
