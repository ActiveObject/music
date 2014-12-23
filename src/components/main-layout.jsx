var React = require('react');
var App = require('app/components/app.jsx');
var Player = require('app/components/player');
var LazyTracklist = require('app/components/lazy-tracklist');
var Box = require('app/components/box.jsx');
var MainView = require('app/components/main-view.jsx');

var appstate = require('app/core/appstate');

var MainLayout = React.createClass({
  componentWillMount: function () {
    this.groups = appstate.groups([41293763]);
    this.activities = appstate.activities([41293763]);
  },

  componentWillUnmount: function() {
    this.groups.release();
    this.activities.release();
  },

  render: function() {
    return (
      <App layout={['two-region', 'main-layout']}>
        <Box prefix='ra-' key='region-a'>
          <MainView groups={this.groups.atom.value} activities={this.activities.atom.value}></MainView>
        </Box>

        <Box prefix='rb-' key='region-b'>
          <LazyTracklist player={this.props.player} tracklist={this.props.player.visibleTracklist()}></LazyTracklist>
        </Box>

        <Box prefix='rc-' key='region-c'>
          <Player player={this.props.player}></Player>
        </Box>
      </App>
    );
  }
});

module.exports = MainLayout;
