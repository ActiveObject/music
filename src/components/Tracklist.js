var React = require('react');
var dom = require('app/core/dom');
var Track = require('app/components/track');
var ActiveTrack = require('app/components/active-track');

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

    var header = dom.div()
      .key('header')
      .className('tracklist-header')
      .append(activeTrack);

    var name = dom.div()
      .key('section')
      .className('tracklist-section-name')
      .append(this.props.name + ' (1243)');

    return dom.div()
      .className('card tracklist')
      .append([header, name].concat(tracks))
      .make();
  }
});