var React = require('react/addons');
var Immutable = require('immutable');

var App = require('app/components/app.jsx');
var Player = require('app/components/player');
var LazyTracklist = require('app/components/lazy-tracklist');
var Box = require('app/components/box.jsx');
var IScrollLayer = require('app/components/iscroll-layer.jsx');
var MainActivityList = require('app/components/main-activity-list.jsx');

var Atom = require('app/core/atom');
var ActivityLoader = require('app/services/activity-loader');
var GroupLoader = require('app/services/groups-loader');
var TracksLoader = require('app/services/tracks-loader');
var eventBus = require('app/core/event-bus');

require('app/styles/main-layout.styl');

var MainLayout = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  componentWillMount: function () {
    this.loaders = this.props.visibleGroups.map(function (id) {
      return new ActivityLoader({
        id: -id,
        period: this.props.period
      });
    }, this);

    this.groupsLoader = new GroupLoader(this.props.user);
    this.tracksLoader = new TracksLoader(this.props.user);

    this.loaders.forEach(function (loader) {
      Atom.listen(loader, function(items) {
        eventBus.push({ e: 'app', a: ':app/activity', v: Immutable.Set(items) });
      });
    });

    Atom.listen(this.groupsLoader, function (groups) {
      eventBus.push({ e: 'app', a: ':app/groups', v: Immutable.Set(groups) });
    });

    Atom.listen(this.tracksLoader, function (tracks) {
      eventBus.push({ e: 'app', a: ':app/tracks', v: Immutable.Set(tracks) });
    });

    this.loaders.forEach(function (loader) {
      loader.process();
    });
    this.groupsLoader.process();
    this.tracksLoader.process();
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
