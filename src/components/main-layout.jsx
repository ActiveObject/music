var React = require('react/addons');
var Immutable = require('immutable');
var isValue = require('app/utils/isValue');

var App = require('app/components/app');
var Player = require('app/components/player');
var LazyTracklist = require('app/components/lazy-tracklist');
var Box = require('app/components/box');
var IScrollLayer = require('app/components/iscroll-layer');
var GroupActivityCard = require('app/components/group-activity-card');

require('app/styles/main-layout.styl');

var ActivityList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render: function () {
    var cards = this.props.visibleGroups
      .map(id => this.props.groups.find(group => group.id === id))
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
            <ActivityList
              visibleGroups={this.props.visibleGroups}
              groups={this.props.groups}
              period={this.props.period} />
          </IScrollLayer>
        </Box>

        <Box prefix='rb-' key='region-b'>
          <LazyTracklist
            player={this.props.player}
            tracklist={this.props.player.visibleTracklist()} />
        </Box>

        <Box prefix='rc-' key='region-c'>
          <Player player={this.props.player}></Player>
        </Box>
      </App>
    );
  }
});

module.exports = MainLayout;
