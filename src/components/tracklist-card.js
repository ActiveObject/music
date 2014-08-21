var React = require('react');
var debug = require('debug')('app:tracklist-card');
var dom = require('app/core/dom');
var ActiveTrack = require('app/components/active-track');
var Tracklist = require('app/components/tracklist');

function print(shouldUpdate) {
  debug('should update: %s', shouldUpdate);
  return shouldUpdate;
}

module.exports = React.createClass({
  displayName: 'TracklistCard',

  propTypes: {
    activeTrack: React.PropTypes.component.isRequired,
    tracklist: React.PropTypes.component.isRequired,
    name: React.PropTypes.string
  },

  render: function() {
    var header = dom.div()
      .key('header')
      .className('tracklist-header')
      .append(this.props.activeTrack);

    var name = dom.div()
      .key('section')
      .className('tracklist-section-name')
      .append(this.props.name + ' (1243)');

    return dom.div()
      .className('card tracklist')
      .append(header, name, this.props.tracklist)
      .make();
  }
});