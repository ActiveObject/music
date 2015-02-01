var React = require('react');
var App = require('app/components/app.jsx');
var Newsfeed = require('app/components/newsfeed.jsx');
var Player = require('app/components/player');
var IScrollLayer = require('app/components/iscroll-layer.jsx');
var Box = require('app/components/box.jsx');
var ActivityCard = require('app/components/activity-card.jsx');

var NewsfeedLoader = require('app/services/newsfeed-loader');
var ActivityLoader = require('app/services/activity-loader');
var Activity = require('app/values/activity');

require('app/styles/group-layout.styl');

var GroupLayout = React.createClass({
  componentWillMount: function() {
    this.newsfeed = new NewsfeedLoader({
      owner: -this.props.id,
      offset: 0,
      count: 10
    });

    this.activityLoader = new ActivityLoader(this.props.id, this.props.activities, this.props.period);
    this.newsfeed.process();
  },

  componentWillUnmount: function() {
    this.newsfeed.release();
  },

  render: function() {
    var group = this.props.groups.find(g => g.id === this.props.id);
    var activity = new Activity(-this.props.id, this.props.period, this.props.activities);

    return (
      <App layout={['two-region', 'group-layout']}>
        <Box prefix='ra-' key='region-a'>
          <div key='group-profile' className='group-profile-info'>
            <div key='avatar' className='group-profile-avatar'>
              <img width='150' height='150' src={group.photo_200} />
            </div>
            <div key='name'>{group.name}</div>
          </div>

          <ActivityCard
            key={group.id}
            defaultColor='#3949AB'
            id={group.id}
            name={group.name}
            activity={activity}></ActivityCard>
        </Box>

        <Box prefix='rb-' key='region-b'>
          <IScrollLayer>
            <Newsfeed newsfeed={this.newsfeed.atom.value} player={this.props.player} owner={group}></Newsfeed>
          </IScrollLayer>
        </Box>

        <Box prefix='rc-' key='region-c'>
          <Player player={this.props.player}></Player>
        </Box>
      </App>
    );
  }
});

module.exports = GroupLayout;
