var React = require('react');
var moment = require('moment');
var dom = React.DOM;

require("moment-duration-format");

function print(value) {
  console.log(value);
  return value;
}

module.exports = React.createClass({
  displayName: 'ActiveTrack',

  shouldComponentUpdate: function (newProps) {
    return print(this.props.track !== newProps.track);
  },

  render: function() {
    var playBtn = dom.span({
      key: 'play-btn',
      className: 'active-track-play-btn'
    });

    var title = dom.span({
      key: 'title',
      className: 'active-track-title'
    }, this.props.track.get('title'));

    var artist = dom.span({
      key: 'artist',
      className: 'active-track-artist'
    }, this.props.track.get('artist'));

    var duration = dom.span({
      key: 'duration',
      className: 'active-track-duration'
    }, moment.duration(this.props.track.get('duration'), 's').format('mm:ss'));

    var separator = dom.span({
      key: 'separator',
      className: 'active-track-separator'
    }, '-');

    var track = dom.div({ key: 'track' }, [ artist, separator, title ]);

    return dom.div({ className: 'card active-track' }, [ playBtn, track, duration ]);
  }
});