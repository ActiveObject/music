var React = require('react');
var App = require('app/components/app.jsx');
var GroupProfile = require('app/components/group-profile.jsx');
var Newsfeed = require('app/components/newsfeed');
var Player = require('app/components/player');
var IScrollLayer = require('app/components/iscroll-layer.jsx');
var Box = require('app/components/box.jsx');

var appstate = require('app/core/appstate');

var GroupLayout = React.createClass({
  componentWillMount: function() {
    this.group = appstate.groupById(this.props.id);
    this.newsfeed = appstate.newsfeedForGroup(this.props.id);
    this.activity = appstate.activityForGroup(this.props.id);
  },

  componentWillUnmount: function() {
    this.group.release();
    this.activity.release();
    this.newsfeed.release();
  },

  render: function() {
    return (
      <App layout={['two-region', 'group-layout']}>
        <Box prefix='ra-' key='region-a'>
          <GroupProfile group={this.group.atom.value} activity={this.activity.atom.value}></GroupProfile>
        </Box>

        <Box prefix='rb-' key='region-b'>
          <IScrollLayer>
            <Newsfeed newsfeed={this.newsfeed.atom.value} player={this.props.player} owner={this.group.atom.value}></Newsfeed>
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
