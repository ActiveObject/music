require('app/styles/track.styl');
require('app/styles/element.styl');

var React = require('react');
var _ = require('underscore');
var Impulse = require('impulse');
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

  getInitialState: function() {
    return {
      x: 0
    }
  },

  componentDidMount: function() {
    this.x = Impulse(this.refs.test.getDOMNode()).style('translate', function(x, y) {
      return x + 'px, ' + y + 'px'
    });

    this.scale = Impulse(this.refs.test.getDOMNode()).style('opacity', function(x, y) {
      return x / 100;
    });
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
      .attr('ref', 'test')
      .append(artist, title);

    return dom.div()
      .className('track')
      .translate(0, this.props.y)
      .append(playBtn, desc, duration)
      .make();
  },

  togglePlay: function () {
    if (this.props.player.isPlaying) {
      this.x.spring({ tension: 100, damping: 10 })
        .from(0, 0)
        .to(100, 0).start();

      this.scale.spring({ tension: 100, damping: 10 })
        .from(0)
        .to(100).start();
    } else {
      this.x.spring({ tension: 200, damping: 10 })
        .from(100, 0)
        .to(0, 0).start();

      this.scale.spring({ tension: 100, damping: 10 })
        .from(100)
        .to(50).start();
    }

    eventBus.push(this.props.player.togglePlay(this.props.track, this.props.tracklist));
  }
});
