require('app/styles/tracklist.styl');

var React = require('react');
var dom = require('app/core/dom');
var Track = require('app/components/track');

module.exports = React.createClass({
  displayName: 'Tracklist',

  propTypes: {
    player: React.PropTypes.object.isRequired,
    playlist: React.PropTypes.object.isRequired
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return nextProps.player.track.id !== this.props.player.track.id ||
      nextProps.player.isPlaying !== this.props.player.isPlaying ||
      nextProps.playlist !== this.props.playlist;
  },

  render: function() {
    var tracks = this.props.playlist.tracks.toJS().map(function (track) {
      return new Track({
        key: track.id,
        track: track,
        player: this.props.player,
        playlist: this.props.playlist,
        y: 0
      });
    }, this);

    var body = dom.div()
      .className('tracklist-body')
      .append(tracks)
      .make();

    return dom.div()
      .className('tracklist')
      .append(body)
      .make();
  }
});
