var React = require('react');
var moment = require('moment');
var PlayBtn = require('app/components/play-btn');
var dom = require('app/core/dom');

require('moment-duration-format');

module.exports = React.createClass({
  displayName: 'ActiveTrack',

  getInitialState: function () {
    return {
      isPlaying: true
    };
  },

  render: function() {
    var track = {
      title: this.props.track.get('title'),
      artist: this.props.track.get('artist'),
      duration: moment.duration(this.props.track.get('duration'), 's').format('mm:ss')
    };

    var playBtn = new PlayBtn({
      key: 'play-btn',
      isPlaying: this.state.isPlaying,
      onClick: this.togglePlay
    });

    var title = dom.span()
      .key('title')
      .className('active-track-title')
      .append(track.title);

    var artist = dom.span()
      .key('artist')
      .className('active-track-artist')
      .append(track.artist);

    var duration = dom.span()
      .key('duration')
      .className('active-track-duration')
      .append(track.duration);

    var separator = dom.span()
      .key('separator')
      .className('active-track-separator')
      .append('-');

    var desc = dom.div()
      .key('track')
      .className('active-track-desc')
      .attr('title', [track.artist, track.title].join(' - '))
      .append(artist, separator, title);

    return dom.div()
      .className('active-track')
      .append(playBtn, desc, duration)
      .make();
  },

  togglePlay: function () {
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }
});