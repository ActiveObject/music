var React = require('react/addons');
var ISet = require('immutable').Set;
var App = require('app/components/app');
var Newsfeed = require('app/components/newsfeed');
var IScrollLayer = require('app/components/iscroll-layer');
var ActivityChart = require('app/components/activity-chart');
var Box = require('app/components/box');
var PlayerContainer = require('app/components/player-container');

var go = require('app/core/go');
var vbus = require('app/core/vbus');
var Atom = require('app/core/atom');
var addTag = require('app/utils/addTag');
var NewsfeedLoader = require('app/processes/newsfeed-loader');
var ActivityLoader = require('app/processes/activity-loader');
var Activity = require('app/values/activity');
var newsfeed = require('app/values/newsfeed');
var ActivityStore = require('app/stores/activity-store');
var GroupStore = require('app/stores/group-store');

var UserPlaylists = require('app/components/user-playlists');

require('app/styles/group-layout.styl');

var GroupActivityCard = React.createClass({
  getInitialState: function () {
    this.activity = ActivityStore.forGroup(this.props.group);

    return {
      activity: this.activity.value
    };
  },

  componentWillMount: function () {
    var out = go(new ActivityLoader(-this.props.group.id, this.props.period))
      .map(addTag(':app/activity'));

    this.unsub1 = Atom.listen(this.activity, (v) => this.setState({ activity: v }));
    this.unsub2 = vbus.plug(out);
  },

  componentWillUnmount: function () {
    this.unsub1();
    this.unsub2();
    this.activity.unsub();
  },

  render: function () {
    var activity = new Activity(-this.props.group.id, this.props.period, this.state.activity);
    return <ActivityChart activity={activity} />;
  }
});


var GroupProfile = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render: function () {
    return (
      <div>
        <div key='group-profile' className='group-profile-info'>
          <div key='avatar' className='group-profile-avatar'>
            <img width='150' height='150' src={this.props.group.photo_200} />
          </div>
          <div key='name'>{this.props.group.name}</div>
        </div>

        <GroupActivityCard group={this.props.group} period={this.props.period} />
      </div>
    );
  }
});

var GroupLayout = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState: function () {
    return {
      newsfeed: newsfeed,
      groups: GroupStore.value
    };
  },

  componentWillMount: function() {
    var nfChannel = go(new NewsfeedLoader({
      owner: -this.props.id,
      offset: 0,
      count: 10
    }));

    this.usubscribe = nfChannel
      .scan(newsfeed, (acc, next) => acc.merge(next))
      .onValue(v => this.setState({ newsfeed: v }));

    this.unsub = Atom.listen(GroupStore, v => this.setState({ groups: v }));
  },

  componentWillUnmount: function() {
    this.usubscribe();
    this.unsub();
  },

  render: function () {
    var group = this.state.groups.find(g => g.id === this.props.id);

    return (
      <App layout={['two-region', 'group-layout']}>
        <Box prefix='ra-' key='region-a'>
          <GroupProfile
            id={this.props.id}
            group={group}
            period={this.props.period}></GroupProfile>
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

module.exports = GroupLayout;
