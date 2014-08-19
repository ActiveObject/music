var React = require('react');
var Track = require('app/components/track');
var dom = React.DOM;

module.exports = React.createClass({
  render: function() {
    var tracks = this.props.tracks.map(function (track) {
      return new Track({
        key: track.id,
        track: track
      });
    });

    var header = dom.div({ key: 'header', className: 'tracklist-header' }, this.props.name);

    return dom.div({ className: 'card tracklist' }, [header].concat(tracks));
  }
});