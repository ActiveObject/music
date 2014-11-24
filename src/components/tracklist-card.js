require('app/styles/tracklist.styl');
require('app/styles/tracklist-card.styl');

var React = require('react');
var debug = require('debug')('app:tracklist-card');
var dom = require('app/core/dom');
var LazyTracklist = require('app/components/lazy-tracklist');
var Player = require('app/components/player');

module.exports = React.createClass({
  displayName: 'TracklistCard',

  propTypes: {
    player: React.PropTypes.object.isRequired
  },

  render: function() {
    var tracklist = new LazyTracklist({
      key: 'tracklist',
      player: this.props.player,
      tracks: this.props.player.playlist.tracks
    });

    var playerView = new Player({
      key: 'player',
      player: this.props.player
    });

    return dom.div()
      .className('tracklist-card')
      .append(tracklist)
      .append(playerView)
      .make();
  }
});
