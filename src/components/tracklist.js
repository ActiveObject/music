require('app/styles/tracklist.styl');

var React = require('react');
var dom = require('app/core/dom');
var Track = React.createFactory(require('app/components/track'));

module.exports = React.createClass({
  displayName: 'Tracklist',

  propTypes: {
    player: React.PropTypes.object.isRequired,
    tracklist: React.PropTypes.object.isRequired
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return nextProps.player.track.id !== this.props.player.track.id ||
      nextProps.player.isPlaying !== this.props.player.isPlaying ||
      nextProps.tracklist !== this.props.tracklist;
  },

  render: function() {
    var tracks = this.props.tracklist.playlist.tracks.toJS().map(function (track) {
      return new Track({
        key: track.id,
        track: track,
        player: this.props.player,
        tracklist: this.props.tracklist,
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
