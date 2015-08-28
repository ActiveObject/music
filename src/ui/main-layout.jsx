var React = require('react/addons');
var Immutable = require('immutable');
var Atom = require('app/core/atom');
var addToSet = require('app/fn/addToSet');
var isValue = require('app/fn/isValue');
var onValue = require('app/fn/onValue');

var App = require('app/ui/app');
var Box = require('app/ui/box');
var IScrollLayer = require('app/ui/iscroll-layer');
var GroupActivityCard = require('app/ui/group-activity-card');
var PlayerContainer = require('app/ui/player-container');
var UserPlaylists = require('app/ui/user-playlists');
var db = require('app/db');

var groups = require('app/db/groups');

require('app/styles/main-layout.styl');

var ActivityList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState: function () {
    return {
      groups: Atom.value(groups)
    };
  },

  componentWillMount: function () {
    this.unsub = Atom.listen(groups, v => this.setState({ groups: v }));
  },

  componentWillUnmount: function () {
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
  render: function() {
    var visibleGroups = db.atom.value.get(':db/visibleGroups');

    return (
      <App layout={['two-region', 'main-layout']}>
        <Box prefix='ra-' key='region-a'>
          <IScrollLayer>
            <span className='main-section-title'>Спільноти</span>
            <ActivityList visibleGroups={visibleGroups} period={this.props.period} />
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

function updateOn(ComposedComponent, dbKey) {
  return React.createClass({
    componentDidMount: function () {
      var stream = db.map(v => v.get(dbKey)).skipDuplicates();
      this.unsub = onValue(stream, () => this.forceUpdate());
    },

    componentWillUnmount: function () {
      this.unsub();
    },

    render: function () {
      return <ComposedComponent {...this.props} />;
    }
  });
}

module.exports = updateOn(MainLayout, ':db/visibleGroups');
