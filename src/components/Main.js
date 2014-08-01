var React = require('react');
var IScroll = require('iscroll');
var ActivityCard = require('app/components/ActivityCard');
var dom = React.DOM;

module.exports = React.createClass({
  componentDidMount: function() {
    this.scroll = new IScroll(this.refs.view.getDOMNode(), {
      mouseWheel: true,
      scrollX: false
    });
  },

  render: function() {
    var groupActivities = this.props.groups.map(function(group) {
      return new ActivityCard(group);
    });

    var userActivity = new ActivityCard({
      name: 'Test',
      activity: this.props.activity
    });

    var groups = dom.div({ key: 'groups', className: 'main-section' }, [
      dom.span({ key: 'title', className: 'main-section-title' }, 'Спільноти'),
      dom.div({ key: 'cards' }, groupActivities)
    ]);

    var user = dom.div({ key: 'user', className: 'main-section' }, [
      dom.span({ key: 'title' , className: 'main-section-title' }, 'Активність'),
      dom.div({ key: 'cards', className: 'main-user-activity' }, userActivity )
    ]);

    return dom.div({ key: 'main', className: 'main-view', ref: 'view' },
      dom.div({ className: 'main-container' }, [user, groups]));
  }
});