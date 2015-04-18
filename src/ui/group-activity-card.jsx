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
var db3 = require('app/core/db3');
var scanSince = require('app/core/db/consumers/scanSince');

var GroupActivityCard = React.createClass({
  getInitialState: function () {
    return {
      activity: ISet()
    };
  },

  componentWillMount: function () {
    var gid = this.props.group.id;

    var stream = db3.install(scanSince(0, ISet(), function(acc, v) {
      if (tagOf(v) === ':app/activity') {
        return acc.union(v[1].filter(v => v.owner === -gid));
      }

      return acc;
    }));

    this.uninstall = onValue(stream.skipDuplicates(), v => this.setState({ activity: v }));

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
