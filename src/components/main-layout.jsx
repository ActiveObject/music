var React = require('react/addons');
var Immutable = require('immutable');

var App = require('app/components/app.jsx');
var Player = require('app/components/player');
var LazyTracklist = require('app/components/lazy-tracklist');
var Box = require('app/components/box.jsx');
var IScrollLayer = require('app/components/iscroll-layer.jsx');
var MainActivityList = require('app/components/main-activity-list.jsx');

var app = require('app');
var Atom = require('app/core/atom');
var ActivityLoader = require('app/services/activity-loader');
var GroupLoader = require('app/services/groups-loader');
var TracksLoader = require('app/services/tracks-loader');
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

    var gout = app
      .go(new GroupLoader(this.props.user))
      .map(v => ({ e: 'app', a: ':app/groups', v: v }));

    var tout = app
      .go(new TracksLoader(this.props.user))
      .map(v => ({ e: 'app', a: ':app/tracks', v: v }))

    eventBus.plug(gout);
    eventBus.plug(tout);
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
