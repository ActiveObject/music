var React = require('react');
var ISet = require('immutable').Set;
var go = require('app/core/go');
var Atom = require('app/core/atom');
var Activity = require('app/values/activity');
var ActivityLoader = require('app/processes/activity-loader');
var ActivityCard = require('app/ui/activity-card');
var vbus = require('app/core/vbus');
var addTag = require('app/fn/addTag');
var tagOf = require('app/fn/tagOf');
var onValue = require('app/fn/onValue');
var plug = require('app/fn/plug');
var db = require('app/db');

var GroupActivityCard = React.createClass({
  getInitialState: function () {
    return {
      activity: ISet()
    };
  },

  componentWillMount: function () {
    var gid = this.props.group.id;

    var stream = db
      .filter(v => v.has(':db/activity'))
      .map(v => v.get(':db/activity'))
      .skipDuplicates()

    this.uninstall = onValue(stream, v => this.setState({ activity: v.filter(item => item.owner === -gid ) }));

    var out = go(new ActivityLoader(-this.props.group.id, this.props.period))
      .map(addTag(':app/activity'));

    this.unsub2 = plug(vbus, out);
  },

  componentWillUnmount: function () {
    this.uninstall();
    this.unsub2();
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
