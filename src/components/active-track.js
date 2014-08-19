var React = require('react');
var moment = require('moment');
var PlayBtn = require('app/components/play-btn');
var dom = React.DOM;

require('moment-duration-format');

function print(value) {
  console.log(value);
  return value;
}

module.exports = React.createClass({
  displayName: 'ActiveTrack',

  getInitialState: function () {
    return {
      isPlaying: false
    };
  },

  render: function() {
    var playBtn = new PlayBtn({
      isPlaying: this.state.isPlaying,
      onClick: this.togglePlay
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

    return dom.div({ className: 'active-track' }, [ playBtn, track, duration ]);
  },

  togglePlay: function () {
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }
});