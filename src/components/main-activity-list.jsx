var React = require('react/addons');
var Seq = require('immutable').Seq;

var Activity = require('app/values/activity');
var isValue = require('app/utils/isValue');

var ActivityCard = require('app/components/activity-card');

var MainActivityList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render: function() {
    var groups = this.props.visibleGroups
      .map(function (id) {
        return this.props.groups.find(function (group) {
          return group.id === id;
        });
      }, this)

      .filter(isValue);

    var activities = this.props.visibleGroups.map(function (id) {
      return new Activity(-id, this.props.period, this.props.activities);
    }, this);

    var cards = Seq(groups).zip(activities).map(function (v) {
      var group = v[0];
      var activity = v[1];

      return <ActivityCard key={group.id} id={group.id} name={group.name} activity={activity}></ActivityCard>;
    });

    return <div>{cards.toArray()}</div>;
  }
});

module.exports = MainActivityList;
