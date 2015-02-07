var React = require('react/addons');
var Immutable = require('immutable');

var App = require('app/components/app');
var Player = require('app/components/player');
var LazyTracklist = require('app/components/lazy-tracklist');
var Box = require('app/components/box');
var IScrollLayer = require('app/components/iscroll-layer');
var MainActivityList = require('app/components/main-activity-list');

var app = require('app');
var ActivityLoader = require('app/processes/activity-loader');
var eventBus = require('app/core/event-bus');

require('app/styles/main-layout.styl');

var MainLayout = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  componentWillMount: function () {
    this.props.visibleGroups.map(function (id) {
      var out = app
        .go(new ActivityLoader(-id, this.props.period))
        .map(v => ({ e: 'app', a: ':app/activity', v: v }));

      eventBus.plug(out);
    }, this);
  },

  render: function() {
    return (
      <App layout={['two-region', 'main-layout']}>
        <Box prefix='ra-' key='region-a'>
          <IScrollLayer>
            <span className='main-section-title'>Спільноти</span>
            <MainActivityList
              visibleGroups={this.props.visibleGroups}
              period={this.props.period}
              groups={this.props.groups}
              activities={this.props.activities}></MainActivityList>
          </IScrollLayer>
        </Box>

        <Box prefix='rb-' key='region-b'>
          <LazyTracklist
            player={this.props.player}
            tracklist={this.props.player.visibleTracklist()}></LazyTracklist>
        </Box>

        <Box prefix='rc-' key='region-c'>
          <Player player={this.props.player}></Player>
        </Box>
      </App>
    );
  }
});

module.exports = MainLayout;
