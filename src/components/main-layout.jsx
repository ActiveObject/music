var React = require('react');
var App = require('app/components/app.jsx');
var Player = require('app/components/player');
var LazyTracklist = require('app/components/lazy-tracklist');
var Box = require('app/components/box.jsx');
var IScrollLayer = require('app/components/iscroll-layer.jsx');
var ActivityCard = require('app/components/activity-card');

var appstate = require('app/core/appstate');

var MainLayout = React.createClass({
  componentWillMount: function () {
    this.groups = appstate.groups([41293763, 32211876, 34110702, 43426041]);
    this.activities = appstate.activities([41293763, 32211876, 34110702, 43426041]);
  },

  componentWillUnmount: function() {
    // this.groups.release();
  },

  render: function() {
    return (
      <App layout={['two-region', 'main-layout']}>
        <Box prefix='ra-' key='region-a'>
          <div className='main-view'>
            <div className='main-view-container'>
              <IScrollLayer>
                <div className='main-section'>
                  <span className='main-section-title'>Спільноти</span>
                  <div className='cards'>{this.groupActivities()}</div>
                </div>
              </IScrollLayer>
            </div>
          </div>
        </Box>

        <Box prefix='rb-' key='region-b'>
          <LazyTracklist player={this.props.player} tracklist={this.props.player.visibleTracklist()}></LazyTracklist>
        </Box>

        <Box prefix='rc-' key='region-c'>
          <Player player={this.props.player}></Player>
        </Box>
      </App>
    );
  },

  groupActivities: function () {
    return this.groups.atom.value.map(function(group) {
      var activity = this.activities.atom.value.find(function (a) {
        return a.owner === -group.id
      });

      return new ActivityCard({
        key: group.id,
        id: group.id,
        name: group.name,
        activity: activity
      });
    }, this).toJS();
  }
});

module.exports = MainLayout;
