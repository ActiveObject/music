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
    playlist: React.PropTypes.object.isRequired,
    track: React.PropTypes.object.isRequired,
    y: React.PropTypes.number.isRequired
  },

  shouldComponentUpdate: function (nextProps) {
    return nextProps.track !== this.props.track ||
      nextProps.playlist !== this.props.playlist ||
      nextProps.player.track.id !== this.props.player.track.id ||
      nextProps.player.isPlaying !== this.props.player.isPlaying ||
      nextProps.y !== this.props.y;
  },

  render: function() {
    var isActive = this.props.track.id === this.props.player.track.id;
    var isPlaying = isActive && this.props.player.isPlaying;

    var playBtn = new PlayBtn({
      key: 'play-btn',
      isPlaying: isPlaying,
      isActive: isActive,
      onClick: this.togglePlay
    });

    var title = dom.div()
      .key('title')
      .className('track-title')
      .append(this.props.track.title);

    var artist = dom.a()
      .key('artist')
      .className('element-link track-artist')
      .attr('href', '/artist/' + this.props.track.artist)
      .append(this.props.track.artist);

    var duration = dom.span()
      .key('duration')
      .className('track-duration')
      .append(moment.duration(this.props.track.duration, 's').format('mm:ss'));

    var desc = dom.div()
      .key('desc')
      .className('track-desc')
      .attr('title', [this.props.track.artist, this.props.track.title].join(' – '))
      .append(artist, title);

    return dom.div()
      .className('track')
      .translate(0, this.props.y)
      .append(playBtn, desc, duration)
      .make();
  },

  togglePlay: function () {
    eventBus.push(this.props.player.togglePlay(this.props.track, this.props.playlist));
  }
});
