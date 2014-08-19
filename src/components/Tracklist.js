var React = require('react');
var Track = require('app/components/track');
var ActiveTrack = require('app/components/active-track');
var dom = React.DOM;

module.exports = React.createClass({
  render: function() {
    var tracks = this.props.tracks.map(function (track) {
      return new Track({
        key: track.id,
        track: track
      });
    });

    var activeTrack = new ActiveTrack({
      track: this.props.activeTrack
    });

    var header = dom.div({ key: 'header', className: 'tracklist-header' }, activeTrack);

    var name = dom.div({ key: 'section', className: 'tracklist-section-name' }, this.props.name + ' (1243)');

    return dom.div({ className: 'card tracklist' }, [header, name].concat(tracks));
  }
});