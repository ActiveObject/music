require('app/styles/tracklist.styl');

var React = require('react');
var _ = require('underscore');
var debug = require('debug')('app:tracklist');
var dom = require('app/core/dom');
var Track = require('app/components/track');

module.exports = React.createClass({
  displayName: 'Tracklist',

  propTypes: {
    activeTrack: React.PropTypes.object.isRequired,
    tracks: React.PropTypes.array.isRequired,
    itemHeight: React.PropTypes.number.isRequired
  },

  render: function() {
    var tracks = this.props.tracks.map(function (track) {
      return new Track({
        key: track.value.id,
        track: track.value,
        y: track.yOffset,
        activeTrack: this.props.activeTrack
      });
    }, this);

    return dom.div()
      .attr('style', { height: this.props.totalTracks * this.props.itemHeight })
      .append(tracks)
      .make();
  }
});