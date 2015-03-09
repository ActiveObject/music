require('app/styles/activity-card.styl');
require('app/styles/element.styl');

var React = require('react/addons');
var ActivityChart = require('app/components/activity-chart');
var router = require('app/core/router');

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
    router.transitionTo(this.route);

    if (window.history) {
      window.history.pushState({}, 'Group ' + this.props.name, this.route.url());
    }
  }
});

module.exports = ActivityCard;
