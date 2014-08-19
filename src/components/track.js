var React = require('react');
var PlayBtn = require('app/components/play-btn');
var dom = React.DOM;

module.exports = React.createClass({
  displayName: 'track',

  getInitialState: function () {
    return {
      isPlaying: false
    };
  },

  render: function() {
    var title = dom.div({ key: 'title', className: 'tracklist-item-title' }, this.props.track.title);
    var artist = dom.div({ key: 'artist', className: 'tracklist-item-artist' }, this.props.track.artist);

    var playBtn = new PlayBtn({
      isPlaying: this.state.isPlaying,
      onClick: this.togglePlay
    });

    var desc = dom.div({ key: 'desc', className: 'tracklist-item-desc' }, [artist, title]);

    return dom.div({ className: 'tracklist-item' }, [playBtn, desc]);
  },

  togglePlay: function () {
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }
});