var React = require('react');

var IScrollLayer = require('app/components/iscroll-layer.jsx');
var ActivityCard = require('app/components/activity-card.jsx');

var LastNWeeksDRange = require('app/values/last-nweeks-drange');

var MainView = React.createClass({
  shouldComponentUpdate: function (nextProps) {
    return this.props.groups !== nextProps.groups || this.props.activities !== nextProps.activities;
  },

  render: function () {
    var activities = this.props.groups.map(function(group) {
      var activity = this.props.activities.get(group.id);
      return <ActivityCard key={group.id} id={group.id} name= {group.name} activity={activity}></ActivityCard>;
    }, this).toJS();

    return (
      <div className='main-view'>
        <div className='main-view-container'>
          <IScrollLayer>
            <div className='main-section'>
              <span className='main-section-title'>Спільноти</span>
              <div className='cards'>{activities}</div>
            </div>
          </IScrollLayer>
        </div>
      </div>
    );
  }
});

module.exports = MainView;
