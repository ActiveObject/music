require('app/styles/active-track.styl');
require('app/styles/play-btn.styl');

var React = require('react');
var moment = require('moment');
var dom = require('app/core/dom');
var vbus = require('app/core/vbus');
var PlayBtn = React.createFactory(require('app/components/play-btn'));
var AudioProgressLine = React.createFactory(require('app/components/audio-progress-line'));
var Tabs = React.createFactory(require('app/components/tabs'));
var formatDuration = require('app/utils/duration');

module.exports = React.createClass({
  displayName: 'ActiveTrack',

  render: function() {
    var track = {
      title: this.props.player.track.audio.title,
      artist: this.props.player.track.audio.artist,
      duration: formatDuration(this.props.player.track.audio.duration),
      position: formatDuration(Math.floor(this.props.player.position / 1000))
    };

    var playBtn = new PlayBtn({
      key: 'play-btn',
      isPlaying: this.props.player.isPlaying,
      isActive: true,
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

    var position = dom.span()
      .key('position')
      .className('active-track-position')
      .append(track.position);

    var time = dom.span()
      .key('track-time')
      .className('active-track-time')
      .append(position, '/', duration);

    var separator = dom.span()
      .key('separator')
      .className('active-track-separator')
      .append('-');

    var desc = dom.div()
      .key('track')
      .className('active-track-desc')
      .attr('title', [track.artist, track.title].join(' – '))
      .append(artist, separator, title);

    var progress = dom.div()
      .key('active-track-progress')
      .className('active-track-progress')
      .append(new AudioProgressLine({ player: this.props.player }));

    var body = dom.div()
      .key('body')
      .className('player-body')
      .append(playBtn, desc, time, progress);

    return dom.div()
      .className('active-track')
      .append(body)
      .make();
  },

  togglePlay: function () {
    vbus.emit(this.props.player.togglePlay());
  },

  changePlaylist: function (id) {
    vbus.emit(this.props.player.switchToTracklist(id));
  }
});
