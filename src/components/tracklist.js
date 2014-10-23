require('app/styles/tracklist.styl');

var React = require('react');
var _ = require('underscore');
var debug = require('debug')('app:tracklist');
var dom = require('app/core/dom');
var Track = require('app/components/track');
var TrackModel = require('app/models/track');

function print(shouldUpdate) {
  debug('should update: %s', shouldUpdate);
  return shouldUpdate;
}

module.exports = React.createClass({
  displayName: 'Tracklist',

  getInitialState: function () {
    return {
      visible: [0, 200]
    };
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return print(nextProps.tracks !== this.props.tracks || !_.isEqual(nextState, this.state) || nextProps.activeTrack !== this.props.activeTrack);
  },

  render: function() {
    var tracks = this.props.tracks
      .slice(this.state.visible[0], this.state.visible[1])
      .filter(_.negate(TrackModel.isEmpty))
      .map(function (track) {
        return new Track({
          key: track.id,
          track: track,
          activeTrack: this.props.activeTrack
        });
      }, this)
      .toJS();

    return dom.div()
      .append(tracks)
      .make();
  }
});