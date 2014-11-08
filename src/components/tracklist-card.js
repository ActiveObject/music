var _ = require('underscore');
var React = require('react');
var debug = require('debug')('app:tracklist-card');
var dom = require('app/core/dom');
var Tracklist = require('app/components/tracklist');
var ActiveTrack = require('app/components/active-track');
var Q = require('app/query');

module.exports = React.createClass({
  displayName: 'TracklistCard',

  propTypes: {
    activeTrack: React.PropTypes.object.isRequired,
    queue: React.PropTypes.object.isRequired
  },

  render: function() {
    var activeTrack = Q.getActiveTrack(this.props.activeTrack, this.props.queue);

    var tracklist = new Tracklist({
      key: 'tracklist',
      activeTrack: activeTrack,
      tracks: this.props.queue.getAll()
    });

    var activeTrackView = new ActiveTrack({
      key: 'active-track',
      track: activeTrack
    });

    return dom.div()
      .className('tracklist-card')
      .append(tracklist)
      .append(activeTrackView)
      .make();
  }
});