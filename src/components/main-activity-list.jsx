var React = require('react/addons');
var Seq = require('immutable').Seq;

var Activity = require('app/values/activity');
var isValue = require('app/utils/isValue');

var ActivityCard = require('app/components/activity-card');

var MainActivityList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render: function() {
    var cards = this.props.visibleGroups
      .map(id => this.props.groups.find(group => group.id === id))
      .filter(isValue)
      .map(function(group) {
        var activity = new Activity(-group.id, this.props.period, this.props.activities);

        return (
          <ActivityCard
            key={group.id}
            id={group.id}
            name={group.name}
            activity={activity} />
        );
      }, this);

    return <div>{cards}</div>;
  }
});

module.exports = MainActivityList;
