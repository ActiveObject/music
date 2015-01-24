var React = require('react');
var Immutable = require('immutable');

var App = require('app/components/app.jsx');
var Player = require('app/components/player');
var LazyTracklist = require('app/components/lazy-tracklist');
var Box = require('app/components/box.jsx');
var MainView = require('app/components/main-view.jsx');

var Atom = require('app/core/atom');
var ActivityLoader = require('app/services/activity-loader');
var GroupLoader = require('app/services/groups-loader');
var eventBus = require('app/core/event-bus');

var MainLayout = React.createClass({
  componentWillMount: function () {
    this.loaders = this.props.visibleGroups.map(function (id) {
      return new ActivityLoader(id, this.props.activities, this.props.period);
    }, this);

    this.loaders.forEach(function (loader) {
      Atom.listen(loader, function(items) {
        eventBus.push({ e: 'app', a: ':app/activity', v: Immutable.Set(items) });
      });

      loader.process();
    });

    this.groupsLoader = new GroupLoader(this.props.user);

    Atom.listen(this.groupsLoader, function (groups) {
      eventBus.push({ e: 'app', a: ':app/groups', v: Immutable.Set(groups) });
    });

    this.groupsLoader.process();
  },

  render: function() {
    return (
      <App layout={['two-region', 'main-layout']}>
        <Box prefix='ra-' key='region-a'>
          <MainView
            groups={this.props.groups}
            activities={this.props.activities}
            visibleGroups={this.props.visibleGroups}
            period={this.props.period}></MainView>
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
