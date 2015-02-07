var React = require('react/addons');
var App = require('app/components/app');
var Newsfeed = require('app/components/newsfeed');
var Player = require('app/components/player');
var IScrollLayer = require('app/components/iscroll-layer');
var Box = require('app/components/box');
var ActivityCard = require('app/components/activity-card');

var app = require('app');
var eventBus = require('app/core/event-bus');
var NewsfeedLoader = require('app/processes/newsfeed-loader');
var ActivityLoader = require('app/processes/activity-loader');
var Activity = require('app/values/activity');
var newsfeed = require('app/values/newsfeed');

require('app/styles/group-layout.styl');

var GroupProfile = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render: function () {
    var activity = new Activity(-this.props.id, this.props.period, this.props.activities);

    return (
      <div>
        <div key='group-profile' className='group-profile-info'>
          <div key='avatar' className='group-profile-avatar'>
            <img width='150' height='150' src={this.props.group.photo_200} />
          </div>
          <div key='name'>{this.props.group.name}</div>
        </div>

        <ActivityCard
          key={this.props.group.id}
          defaultColor='#3949AB'
          id={this.props.group.id}
          name={this.props.group.name}
          activity={activity}></ActivityCard>
      </div>
    );
  }
});

var GroupLayout = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState: function () {
    return { newsfeed: newsfeed };
  },

  componentWillMount: function() {
    var nfChannel = app.go(new NewsfeedLoader({
      owner: -this.props.id,
      offset: 0,
      count: 10
    }));

    this.usubscribe = nfChannel
      .scan(newsfeed, (acc, next) => acc.merge(next))
      .onValue(v => this.setState({ newsfeed: v }));

    var out = app
      .go(new ActivityLoader(-this.props.id, this.props.period))
      .map(v => ({ e: 'app', a: ':app/activity', v: v }));

    eventBus.plug(out);
  },

  componentWillUnmount: function() {
    this.usubscribe();
  },

  render: function() {
    var group = this.props.groups.find(g => g.id === this.props.id);

    return (
      <App layout={['two-region', 'group-layout']}>
        <Box prefix='ra-' key='region-a'>
          <GroupProfile
            id={this.props.id}
            group={group}
            activities={this.props.activities}
            period={this.props.period}></GroupProfile>
        </Box>

        <Box prefix='rb-' key='region-b'>
          <IScrollLayer>
            <Newsfeed newsfeed={this.state.newsfeed} player={this.props.player} owner={group}></Newsfeed>
          </IScrollLayer>
        </Box>

        <Box prefix='rc-' key='region-c'>
          <Player player={this.props.player}></Player>
        </Box>
      </App>
    );
  }
});

module.exports = GroupLayout;
