var React = require('react');
var Seq = require('immutable').Seq;

var IScrollLayer = require('app/components/iscroll-layer.jsx');
var ActivityCard = require('app/components/activity-card.jsx');

var Activity = require('app/values/activity');
var isValue = require('app/utils/isValue');
var print = require('app/utils/print');

var MainView = React.createClass({
  shouldComponentUpdate: function (nextProps) {
    return print(this.props.groups !== nextProps.groups ||
      this.props.activities !== nextProps.activities ||
      this.props.period !== nextProps.period ||
      this.props.visibleGroups !== nextProps.visibleGroups);
  },

  render: function () {
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

    return (
      <div className='main-view'>
        <div className='main-view-container'>
          <IScrollLayer>
            <div className='main-section'>
              <span className='main-section-title'>Спільноти</span>
              <div className='cards'>{cards.toArray()}</div>
            </div>
          </IScrollLayer>
        </div>
      </div>
    );
  }
});

module.exports = MainView;
