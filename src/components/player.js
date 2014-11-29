require('app/styles/active-track.styl');

var React = require('react');
var moment = require('moment');
var dom = require('app/core/dom');
var eventBus = require('app/core/event-bus');
var PlayBtn = require('app/components/play-btn');
var AudioProgressLine = require('app/components/audio-progress-line');
var Tabs = require('app/components/tabs');

require('moment-duration-format');

function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

function formatDuration(d) {
  return pad(d.minutes()) + ':' + pad(d.seconds());
}

module.exports = React.createClass({
  displayName: 'ActiveTrack',

  render: function() {
    var track = {
      title: this.props.player.track.title,
      artist: this.props.player.track.artist,
      duration: formatDuration(moment.duration(this.props.player.track.duration, 's')),
      position: formatDuration(moment.duration(this.props.player.position, 'ms'))
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

    var tabs = dom.div()
      .key('tabs')
      .className('player-playlist-tabs player-playlist-tabs-active')
      .append(new Tabs({
        items: this.props.player.recentPlaylists.map(function (item) {
          return { text: item.playlist.name, isActive: item.visible, id: item.playlist.id };
        }),

        onChange: this.changePlaylist
      }));

    return dom.div()
      .className('active-track')
      .append(body, tabs)
      .make();
  },

  togglePlay: function () {
    eventBus.togglePlay(this.props.player.track, this.props.player.playlist);
  },

  changePlaylist: function (id) {
    eventBus.switchPlaylist(id);
  }
});
