var React = require('react/addons');
var Immutable = require('immutable');
var Atom = require('app/core/atom');
var db = require('app/core/db');
var tagOf = require('app/utils/tagOf');
var isValue = require('app/utils/isValue');

var App = require('app/components/app');
var Box = require('app/components/box');
var IScrollLayer = require('app/components/iscroll-layer');
var GroupActivityCard = require('app/components/group-activity-card');
var PlayerContainer = require('app/components/player-container');
var UserPlaylists = require('app/components/user-playlists');

var groups = require('app/groups');

require('app/styles/main-layout.styl');

var ActivityList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState: function () {
    return {
      groups: Atom.value(groups)
    };
  },

  componentWillMount: function () {
    this.uninstallGroups = db.install(groups, function (acc, v) {
      if (tagOf(v) === ':app/groups') {
        return acc.union(v[1]);
      }

      return acc;
    });

    this.unsub = Atom.listen(groups, v => this.setState({ groups: v }));
  },

  componentWillUnmount: function () {
    this.uninstallGroups();
    this.unsub();
  },

  render: function () {
    var cards = this.props.visibleGroups
      .map(id => this.state.groups.find(group => group.id === id))
      .filter(isValue)
      .map(group => <GroupActivityCard period={this.props.period} group={group} />);

    return <div>{cards}</div>;
  }
});

var MainLayout = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render: function() {
    return (
      <App layout={['two-region', 'main-layout']}>
        <Box prefix='ra-' key='region-a'>
          <IScrollLayer>
            <span className='main-section-title'>Спільноти</span>
            <ActivityList visibleGroups={this.props.visibleGroups} period={this.props.period} />
          </IScrollLayer>
        </Box>

        <Box prefix='rb-' key='region-b'>
          <IScrollLayer>
            <UserPlaylists />
          </IScrollLayer>
        </Box>

        <Box prefix='rc-' key='region-c'>
          <PlayerContainer />
        </Box>
      </App>
    );
  }
});

module.exports = MainLayout;
