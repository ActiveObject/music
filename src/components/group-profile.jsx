require('app/styles/group-profile.styl');

var React = require('react');
var ActivityCard = require('app/components/activity-card');
var eventBus = require('app/core/event-bus');

module.exports = React.createClass({
  displayName: 'GroupProfile',

  componentDidMount: function() {
    eventBus.push(this.props.group.wall.lastNWeeksActivity(33).load());
  },

  render: function () {
    return (
      <div className='group-profile'>
        <div key='profile' className='group-profile-info'>
          <div key='avatar' className='group-profile-avatar'>
            <img width='150' height='150' src={this.props.group.photo_200} />
          </div>
          <div key='name'>{this.props.group.name}</div>
        </div>

        <ActivityCard
          key='activity'
          defaultColor='#3949AB'
          id={this.props.group.id}
          name={this.props.name}
          activity={this.props.group.wall.lastNWeeksActivity(33).activity}></ActivityCard>
      </div>
    );
  }
});
