var React = require('react');
var ISet = require('immutable').Set;
var go = require('app/core/go');
var Atom = require('app/core/atom');
var Activity = require('app/values/activity');
var ActivityLoader = require('app/processes/activity-loader');
var ActivityCard = require('app/components/activity-card');
var vbus = require('app/core/vbus');
var addTag = require('app/utils/addTag');
var tagOf = require('app/utils/tagOf');
var db = require('app/core/db');

var GroupActivityCard = React.createClass({
  getInitialState: function () {
    this.activity = new Atom(ISet());

    return {
      activity: Atom.value(this.activity)
    };
  },

  componentWillMount: function () {
    var gid = this.props.group.id;

    this.uninstall = db.install(this.activity, function (acc, v) {
      if (tagOf(v) === ':app/activity') {
        return acc.union(v[1].filter(v => v.owner === -gid));
      }

      return acc;
    });

    var out = go(new ActivityLoader(-this.props.group.id, this.props.period))
      .map(addTag(':app/activity'));

    this.unsub1 = Atom.listen(this.activity, (v) => this.setState({ activity: v }));
    this.unsub2 = vbus.plug(out);
  },

  componentWillUnmount: function () {
    this.unsub1();
    this.unsub2();
    this.uninstall();
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
