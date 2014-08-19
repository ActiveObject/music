var React = require('react');
var moment = require('moment');
var PlayBtn = require('app/components/play-btn');
var dom = React.DOM;

require('moment-duration-format');

module.exports = React.createClass({
  displayName: 'track',

  getInitialState: function () {
    return {
      isPlaying: false
    };
  },

  render: function() {
    var title = dom.div({
      key: 'title',
      className: 'tracklist-item-title',
    }, this.props.track.title);

    var artist = dom.div({
      key: 'artist',
      className: 'tracklist-item-artist'
    }, this.props.track.artist);

    var playBtn = new PlayBtn({
      isPlaying: this.state.isPlaying,
      onClick: this.togglePlay
    });

    var duration = dom.span({
      key: 'duration',
      className: 'track-duration'
    }, moment.duration(this.props.track.duration, 's').format('mm:ss'));

    var desc = dom.div({
      key: 'desc',
      className: 'tracklist-item-desc',
      title: [this.props.track.artist, this.props.track.title].join(' - ')
    }, [artist, title]);

    return dom.div({ className: 'tracklist-item' }, [playBtn, desc, duration]);
  },

  togglePlay: function () {
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }
});