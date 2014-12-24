var React = require('react');
var App = require('app/components/app.jsx');
var Player = require('app/components/player');
var LazyTracklist = require('app/components/lazy-tracklist');
var Box = require('app/components/box.jsx');
var MainView = require('app/components/main-view.jsx');

var appstate = require('app/core/appstate');

var MainLayout = React.createClass({
  getInitialState: function() {
    return {
      visibleGroups: [41293763, 32211876, 34110702, 28152291, 27894770]
    };
  },

  componentWillMount: function () {
    this.groups = appstate.groups(this.state.visibleGroups);
    this.activities = appstate.activities(this.state.visibleGroups);
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
