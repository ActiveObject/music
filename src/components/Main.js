var _ = require('underscore');
var React = require('react');
var IScroll = require('iscroll');
var ActivityCard = require('app/components/activity-card');
var Group = require('app/models/group');
var dom = React.DOM;

module.exports = React.createClass({
  displayName: 'Main',

  shouldComponentUpdate: function (nextProps) {
    return nextProps.groups !== this.props.groups;
  },

  componentDidMount: function() {
    this.scroll = new IScroll(this.refs.view.getDOMNode(), {
      mouseWheel: true,
      scrollX: false
    });
  },

  componentDidUpdate: function () {
    this.scroll.refresh();
  },

  render: function() {
    // var userActivity = new ActivityCard({
    //   name: 'Test',
    //   activity: this.props.activity
    // });

    var groups = dom.div({ key: 'groups', className: 'main-section' }, [
      dom.span({ key: 'title', className: 'main-section-title' }, 'Спільноти'),
      dom.div({ key: 'cards' }, this.groupActivities())
    ]);

    // var user = dom.div({ key: 'user', className: 'main-section' }, [
    //   dom.span({ key: 'title' , className: 'main-section-title' }, 'Активність'),
    //   dom.div({ key: 'cards', className: 'main-user-activity' }, userActivity )
    // ]);

    return dom.div({ key: 'main', className: 'main-view scroll-wrapper', ref: 'view' },
      dom.div({ className: 'main-container' }, [groups]));
  },

  groupActivities: function () {
    return this.props.groups
      .slice(0, 10)
      .filter(_.negate(Group.isEmpty))
      .map(function(group) {
        return new ActivityCard({
          key: group.id,
          id: group.id,
          name: group.name,
          activity: []
        });
      })
      .toJS();
  }
});