var React = require('react');
var ActivityCard = React.createFactory(require('app/components/activity-card'));
var IScrollLayer = require('app/components/iscroll-layer.jsx');

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

    // var user = dom.div({ key: 'user', className: 'main-section' }, [
    //   dom.span({ key: 'title' , className: 'main-section-title' }, 'Активність'),
    //   dom.div({ key: 'cards', className: 'main-user-activity' }, userActivity )
    // ]);

    return (
      <div className='main-view'>
        <div className='main-view-container'>
          <IScrollLayer>
            <div className='main-section'>
              <span className='main-section-title'>Спільноти</span>
              <div className='cards'>{this.groupActivities()}</div>
            </div>
          </IScrollLayer>
        </div>
      </div>
    );
  },

  groupActivities: function () {
    return this.props.groups.items.filter(function(group) {
      return [41293763, 32211876, 34110702, 43426041].indexOf(group.id) !== -1;
    }).map(function(group) {
      return new ActivityCard({
        key: group.id,
        id: group.id,
        name: group.name,
        activity: group.wall.lastNWeeksActivity(33).activity
      });
    }).toJS();
  }
});
