var React = require('react');
var ISet = require('immutable').Set;
var app = require('app');
var Activity = require('app/values/activity');
var ActivityLoader = require('app/processes/activity-loader');
var ActivityCard = require('app/components/activity-card');

var GroupActivityCard = React.createClass({
  getInitialState: function () {
    return {
      activity: ISet()
    };
  },

  componentWillMount: function () {
    var out = app
      .go(new ActivityLoader(-this.props.group.id, this.props.period))
      .scan(this.state.activity, (v, next) => v.union(next))

    this.unsub = out.onValue(v => this.setState({ activity: v }))
  },

  componentWillUnmount: function () {
    this.unsub();
  },

  render: function () {
    var activity = new Activity(-this.props.group.id, this.props.period, this.state.activity);

    return (
      <ActivityCard
        key={this.props.group.id}
        id={this.props.group.id}
        name={this.props.group.name}
        activity={activity} />
    );
  }
});

module.exports = GroupActivityCard;