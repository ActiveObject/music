require('app/styles/group-profile.styl');

var React = require('react');
var ActivityCard = require('app/components/activity-card');
var dom = React.DOM;

module.exports = React.createClass({
  displayName: 'GroupProfile',

  render: function () {
    var avatar = dom.div({ key: 'avatar', className: 'group-profile-avatar' },
      dom.img({
        width: 150,
        height: 150,
        src: this.props.group.photo_200
      })
    );

    var name = dom.div({ key: 'name' }, this.props.group.name);

    var profile = dom.div({ key: 'profile', className: 'group-profile-info' }, [avatar, name]);

    var activity = new ActivityCard({
      key: 'activity',
      defaultColor: '#3949AB',
      id: this.props.group.id,
      name: this.props.name,
      activity: this.props.group.activity
    });

    return dom.div({
      className: 'main-view group-profile',
    }, [profile, activity]);
  }
});