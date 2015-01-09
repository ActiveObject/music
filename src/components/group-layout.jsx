var React = require('react');
var App = require('app/components/app.jsx');
var GroupProfile = require('app/components/group-profile.jsx');
var Newsfeed = require('app/components/newsfeed');
var Player = require('app/components/player');
var IScrollLayer = require('app/components/iscroll-layer.jsx');
var Box = require('app/components/box.jsx');

var NewsfeedLoader = require('app/services/newsfeed-loader');
var ActivityLoader = require('app/services/activity-loader');
var Activity = require('app/values/activity');

var GroupLayout = React.createClass({
  componentWillMount: function() {
    this.newsfeed = new NewsfeedLoader(-this.props.id);
    this.activityLoader = new ActivityLoader(this.props.id, this.props.activities, this.props.period);

    this.newsfeed.load(0, 10);
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
          <GroupProfile group={group} activity={activity}></GroupProfile>
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
