var React = require('react');
var ActivityCard = React.createFactory(require('app/components/activity-card'));
var IScrollLayer = React.createFactory(require('app/components/iscroll-layer'));
var Layer = React.createFactory(require('app/components/layer'));
var dom = React.DOM;

module.exports = React.createClass({
  displayName: 'Main',

  shouldComponentUpdate: function (nextProps) {
    return nextProps.groups !== this.props.groups;
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

    var scrollContainer = new IScrollLayer({}, groups);
    var body = new Layer({ className: 'pane-body main-view-container' }, scrollContainer);

    return dom.div({ className: 'main-view' }, body);
  },

  groupActivities: function () {
    return this.props.groups.items.filter(function(group) {
      return [41293763, 32211876, 34110702, 43426041].indexOf(group.id) !== -1;
    }).map(function(group) {
      return new ActivityCard({
        key: group.id,
        id: group.id,
        name: group.name,
        activity: group.activity
      });
    }).toJS();
  }
});
