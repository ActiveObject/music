require('app/styles/track.styl');
require('app/styles/element.styl');

var React = require('react');
var moment = require('moment');
var dom = require('app/core/dom');
var eventBus = require('app/core/event-bus');
var PlayBtn = React.createFactory(require('app/components/play-btn'));

require('moment-duration-format');

module.exports = React.createClass({
  displayName: 'Track',

  propTypes: {
    player: React.PropTypes.object.isRequired,
    tracklist: React.PropTypes.object.isRequired,
    track: React.PropTypes.object.isRequired,
    y: React.PropTypes.number.isRequired
  },

  shouldComponentUpdate: function (nextProps) {
    return nextProps.track !== this.props.track ||
      nextProps.tracklist !== this.props.tracklist ||
      nextProps.player.track.id !== this.props.player.track.id ||
      nextProps.player.isPlaying !== this.props.player.isPlaying ||
      nextProps.y !== this.props.y;
  },

  render: function() {
    var isActive = this.props.track.id === this.props.player.track.id;
    var isPlaying = isActive && this.props.player.isPlaying;
    var audio = this.props.track.audio;

    var playBtn = new PlayBtn({
      key: 'play-btn',
      isPlaying: isPlaying,
      isActive: isActive,
      onClick: this.togglePlay
    });

    var title = dom.div()
      .key('title')
      .className('track-title')
      .append(audio.title);

    var artist = dom.a()
      .key('artist')
      .className('element-link track-artist')
      .attr('href', '/artist/' + audio.artist)
      .append(audio.artist);

    var duration = dom.span()
      .key('duration')
      .className('track-duration')
      .append(moment.duration(audio.duration, 's').format('mm:ss'));

    var desc = dom.div()
      .key('desc')
      .className('track-desc')
      .attr('title', [audio.artist, audio.title].join(' – '))
      .append(artist, title);

    return dom.div()
      .className('track')
      .translate(0, this.props.y)
      .append(playBtn, desc, duration)
      .make();
  },

  togglePlay: function () {
    eventBus.push(this.props.player.togglePlay(this.props.track, this.props.tracklist));
  }
});
