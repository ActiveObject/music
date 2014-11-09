var React = require('react');
var debug = require('debug')('app:tracklist-card');
var dom = require('app/core/dom');
var Tracklist = require('app/components/tracklist');
var ActiveTrack = require('app/components/active-track');

module.exports = React.createClass({
  displayName: 'TracklistCard',

  propTypes: {
    activeTrack: React.PropTypes.object.isRequired,
    queue: React.PropTypes.object.isRequired
  },

  render: function() {
    var tracklist = new Tracklist({
      key: 'tracklist',
      activeTrack: this.props.activeTrack,
      tracks: this.props.queue.getAll()
    });

    var activeTrackView = new ActiveTrack({
      key: 'active-track',
      track: this.props.activeTrack
    });

    return dom.div()
      .className('tracklist-card')
      .append(tracklist)
      .append(activeTrackView)
      .make();
  }
});