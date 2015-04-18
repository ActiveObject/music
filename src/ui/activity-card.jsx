require('app/styles/activity-card.styl');
require('app/styles/element.styl');

var React = require('react/addons');
var ActivityChart = require('app/ui/activity-chart');
var vbus = require('app/core/vbus');

var ActivityCard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  componentWillMount: function() {
    var GroupRoute = require('app/routes/group-route');
    this.route = new GroupRoute({ id: this.props.id });
  },

  render: function() {
    return (
      <div className='activity'>
        <a className='element-link activity-name' href={this.route.url()} onClick={this.goToGroup}>{this.props.name}</a>
        <ActivityChart activity={this.props.activity} />
      </div>
    );
  },

  goToGroup: function(e) {
    e.preventDefault();
    vbus.emit(this.route);
  }
});

module.exports = ActivityCard;
