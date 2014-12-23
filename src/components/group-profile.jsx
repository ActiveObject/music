require('app/styles/group-profile.styl');

var React = require('react');
var ActivityCard = require('app/components/activity-card.jsx');

module.exports = React.createClass({
  displayName: 'GroupProfile',

  shouldComponentUpdate: function(nextProps) {
    return nextProps.group !== this.props.group || nextProps.activity !== this.props.activity;
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
          activity={this.props.activity}></ActivityCard>
      </div>
    );
  }
});
