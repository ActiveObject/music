var React = require('react/addons');
var ISet = require('immutable').Set;
var App = require('app/ui/app');
var Newsfeed = require('app/ui/newsfeed');
var IScrollLayer = require('app/ui/iscroll-layer');
var ActivityChart = require('app/ui/activity-chart');
var Box = require('app/ui/box');
var PlayerContainer = require('app/ui/player-container');

var go = require('app/core/go');
var vbus = require('app/core/vbus');
var Atom = require('app/core/atom');
var addTag = require('app/fn/addTag');
var tagOf = require('app/fn/tagOf');
var plug = require('app/fn/plug');
var onValue = require('app/fn/onValue');
var addToSet = require('app/fn/addToSet');
var NewsfeedLoader = require('app/processes/newsfeed-loader');
var ActivityLoader = require('app/processes/activity-loader');
var Activity = require('app/values/activity');
var newsfeed = require('app/values/newsfeed');
var groups = require('app/db/groups');
var db = require('app/db');

var UserPlaylists = require('app/ui/user-playlists');

require('app/styles/group-layout.styl');

var GroupActivityCard = React.createClass({
  getInitialState: function () {
    return {
      activity: ISet()
    };
  },

  componentWillMount: function () {
    var gid = this.props.group.id;

    var stream = db.changes
      .filter(v => v.has(':db/activity'))
      .map(v => v.get(':db/activity'))
      .skipDuplicates()

    this.uninstall = onValue(stream, v => this.setState({ activity: v.filter(item => item.owner === -gid ) }));

    var out = go(new ActivityLoader(-this.props.group.id, this.props.period))
      .map(addTag(':app/activity'));

    this.unsub2 = plug(vbus, out);
  },

  componentWillUnmount: function () {
    this.unsub2();
    this.uninstall();
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
      newsfeed: newsfeed
    };
  },

  componentWillMount: function() {
    var nfChannel = go(new NewsfeedLoader({
      owner: -this.props.id,
      offset: 0,
      count: 10
    }));

    this.usubscribe = onValue(nfChannel.scan((acc, next) => acc.merge(next), newsfeed),
      v => this.setState({ newsfeed: v }));

    this.unsub = Atom.listen(groups, () => this.forceUpdate());
  },

  componentWillUnmount: function() {
    this.usubscribe();
    this.unsub();
  },

  render: function () {
    var group = db.value.get(':db/groups').find(g => g.id === this.props.id);

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
