var React = require('react/addons');
var Immutable = require('immutable');
var isValue = require('app/utils/isValue');

var App = require('app/components/app');
var Player = require('app/components/player');
var Tracklist = require('app/components/tracklist');
var Box = require('app/components/box');
var IScrollLayer = require('app/components/iscroll-layer');
var GroupActivityCard = require('app/components/group-activity-card');

var Atom = require('app/core/atom');
var GroupStore = require('app/stores/group-store');
var TrackStore = require('app/stores/track-store');
var PlayerStore = require('app/stores/player-store');
var Playlist = require('app/values/playlist');
var GenreTracklist = require('app/values/tracklists/genre-tracklist');

require('app/styles/main-layout.styl');

var ActivityList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState: function () {
    return {
      groups: GroupStore.value
    };
  },

  componentWillMount: function () {
    this.unsub = Atom.listen(GroupStore, v => this.setState({ groups: v }));
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

var PlaylistView = React.createClass({
  getInitialState: function () {
    return {
      player: PlayerStore.value
    };
  },

  componentWillMount: function () {
    this.unsub = Atom.listen(PlayerStore, v => this.setState({ player: v }));
  },

  componentWillUnmount: function () {
    this.unsub();
  },

  render: function() {
    return (
      <div className='playlist'>
        <h3>{this.props.value.name}</h3>
        <Tracklist player={this.state.player} tracklist={this.props.value} />
      </div>
    );
  }
});

var MainLayout = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState: function () {
    return {
      tracks: TrackStore.value
    };
  },

  componentWillMount: function () {
    this.unsub = Atom.listen(TrackStore, v => this.setState({ tracks: v }));
  },

  componentWillUnmount: function () {
    this.unsub();
  },

  render: function() {
    var playlists = [
      this.props.player.visibleTracklist(),
      new GenreTracklist({
        genre: 19024584,
        name: 'Progressive Breaks',
        playlist: new Playlist({
          tracks: Immutable.List(),
          isShuffled: false,
          isRepeated: false
        })
      }).update(this.state.tracks),
      new GenreTracklist({
        genre: 19507776,
        name: 'DnB',
        playlist: new Playlist({
          tracks: Immutable.List(),
          isShuffled: false,
          isRepeated: false
        })
      }).update(this.state.tracks),
      new GenreTracklist({
        genre: 19024555,
        name: 'Dubstep',
        playlist: new Playlist({
          tracks: Immutable.List(),
          isShuffled: false,
          isRepeated: false
        })
      }).update(this.state.tracks),
      new GenreTracklist({
        genre: 22196201,
        name: 'Breaks',
        playlist: new Playlist({
          tracks: Immutable.List(),
          isShuffled: false,
          isRepeated: false
        })
      }).update(this.state.tracks)
    ].map(function (tracklist) {
      return <PlaylistView value={tracklist} />;
    }, this);

    return (
      <App layout={['two-region', 'main-layout']}>
        <Box prefix='ra-' key='region-a'>
          <IScrollLayer>
            <span className='main-section-title'>Спільноти</span>
            <ActivityList visibleGroups={this.props.visibleGroups} period={this.props.period} />
          </IScrollLayer>
        </Box>

        <Box prefix='rb-' key='region-b'>
          <IScrollLayer>{playlists}</IScrollLayer>
        </Box>

        <Box prefix='rc-' key='region-c'>
          <Player player={this.props.player}></Player>
        </Box>
      </App>
    );
  }
});

module.exports = MainLayout;
