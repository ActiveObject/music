var React = require('react');
var ActivityCard = require('app/components/activity-card');
var dom = React.DOM;

module.exports = React.createClass({
  displayName: 'group-profile',

  render: function () {
    var avatar = dom.div({ className: 'group-profile-avatar' },
      dom.img({
        width: 150,
        height: 150,
        src: this.props.group.photo_200
      })
    );

    var name = dom.div(null, this.props.group.name);

    var profile = dom.div({ className: 'group-profile-info' }, [avatar, name]);

    var activity = new ActivityCard({
      key: 'activity',
      size: 20,
      margin: 2,
      defaultColor: '#3949AB',
      id: this.props.group.id,
      name: this.props.name,
      activity: [
        { date: '2014-07-20', news: 3 },
        { date: '2014-07-19', news: 13 },
        { date: '2014-07-17', news: 8 },
        { date: '2014-07-16', news: 1 },
        { date: '2014-07-13', news: 8 },
        { date: '2014-07-12', news: 8 },
        { date: '2014-07-04', news: 13 },
        { date: '2014-07-03', news: 8 },
        { date: '2014-06-02', news: 13 },
        { date: '2014-05-30', news: 12 },
        { date: '2014-05-27', news: 8 },
        { date: '2014-05-26', news: 8 }
      ]
    });

    return dom.div({
      key: 'group-profile',
      className: 'main-view group-profile',
    }, [profile, activity]);
  }
});