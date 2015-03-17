var React = require('react');
var app = require('app');
var Atom = require('app/core/atom');
var Activity = require('app/values/activity');
var ActivityLoader = require('app/processes/activity-loader');
var ActivityCard = require('app/components/activity-card');
var ActivityStore = require('app/stores/activity-store');
var vbus = require('app/core/vbus');
var addTag = require('app/utils/addTag');

var GroupActivityCard = React.createClass({
  getInitialState: function () {
    this.activity = ActivityStore.forGroup(this.props.group);

    return {
      activity: this.activity.value
    };
  },

  componentWillMount: function () {
    var out = app
      .go(new ActivityLoader(-this.props.group.id, this.props.period))
      .map(addTag(':app/activity'));

    this.unsub1 = Atom.listen(this.activity, (v) => this.setState({ activity: v }));
    this.unsub2 = vbus.plug(out);
  },

  componentWillUnmount: function () {
    this.unsub1();
    this.unsub2();
    this.activity.unsub();
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