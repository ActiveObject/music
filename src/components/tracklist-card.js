var React = require('react');
var dom = require('app/core/dom');
var ActiveTrack = require('app/components/active-track');
var Tracklist = require('app/components/tracklist');

function print(shouldUpdate) {
  console.log('TracklistCard shouldUpdate: ', shouldUpdate);
  return shouldUpdate;
}

module.exports = React.createClass({
  displayName: 'TracklistCard',

  shouldComponentUpdate: function (nextProps) {
    return print(nextProps.tracks !== this.props.tracks || nextProps.activeTrack !== this.props.activeTrack);
  },

  render: function() {
    var tracklist = new Tracklist({
      tracks: this.props.tracks,
      cursor: {
        activeTrack: this.props.cursor.activeTrack
      }
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
      .append(header, name, tracklist)
      .make();
  }
});