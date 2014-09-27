var React = require('react');
var moment = require('moment');
var Immutable = require('immutable');
var PlayBtn = require('app/components/play-btn');
var dom = require('app/core/dom');
var app = require('app/core/app');

require('moment-duration-format');

module.exports = React.createClass({
  displayName: 'Track',

  shouldComponentUpdate: function (nextProps) {
    return nextProps.track !== this.props.track || nextProps.activeTrack !== this.props.activeTrack;
  },

  render: function() {
    var isActive = this.props.track.id === this.props.activeTrack.id;
    var isPlaying = isActive && this.props.activeTrack.isPlaying;

    var playBtn = new PlayBtn({
      key: 'play-btn',
      isPlaying: isPlaying,
      isActive: isActive,
      onClick: this.togglePlay
    });

    var title = dom.div()
      .key('title')
      .className('tracklist-item-title')
      .append(this.props.track.title);

    var artist = dom.div()
      .key('artist')
      .className('tracklist-item-artist')
      .append(this.props.track.artist);

    var duration = dom.span()
      .key('duration')
      .className('track-duration')
      .append(moment.duration(this.props.track.duration, 's').format('mm:ss'));

    var desc = dom.div()
      .key('desc')
      .className('tracklist-item-desc')
      .attr('title', [this.props.track.artist, this.props.track.title].join(' - '))
      .append(artist, title);

    return dom.div()
      .className('tracklist-item')
      .append(playBtn, desc, duration)
      .make();
  },

  togglePlay: function () {
    app.togglePlay(this.props.track);
  }
});