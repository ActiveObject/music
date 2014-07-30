var React = require('react');
var IScroll = require('iscroll');
var GroupActivityCard = require('app/components/GroupActivityCard');
var _ = React.DOM;

module.exports = React.createClass({
  componentDidMount: function() {
    this.scroll = new IScroll(this.refs.view.getDOMNode(), {
      mouseWheel: true,
      scrollX: false
    });
  },

  render: function() {
    var groupActivities = this.props.groups.map(function(group) {
      return new GroupActivityCard(group);
    });

    var groups = _.div({ className: 'main-groups'},
      [_.span({ className: 'main-groups-title' }, 'Спільноти')].concat(groupActivities)
    );

    return _.div({ className: 'main-view', ref: 'view' },
      _.div({ className: 'main-container' }, groups));
  }
});