var React = require('react');
var debug = require('debug')('app:tracklist-card');
var dom = require('app/core/dom');
var Tracklist = require('app/components/tracklist');
var Player = require('app/components/player');

module.exports = React.createClass({
  displayName: 'TracklistCard',

  propTypes: {
    player: React.PropTypes.object.isRequired,
    queue: React.PropTypes.object.isRequired
  },

  render: function() {
    var tracklist = new Tracklist({
      key: 'tracklist',
      player: this.props.player,
      tracks: this.props.queue.getAll()
    });

    var playerView = new Player({
      key: 'player',
      track: this.props.player
    });

    return dom.div()
      .className('tracklist-card')
      .append(tracklist)
      .append(playerView)
      .make();
  }
});
