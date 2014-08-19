var React = require('react');
var Icon = require('app/components/icon');
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

    var icon = new Icon({
      id: this.state.isPlaying ? 'shape-pause' : 'shape-iconmonstr-arrow-37-icon',
      onClick: this.togglePlay
    });

    var playBtn = dom.div({
      key: 'play-btn',
      className: 'play-btn' + (this.state.isPlaying ? ' active' : ''),
      onClick: this.togglePlay
    }, icon);

    var desc = dom.div({ key: 'desc', className: 'tracklist-item-desc' }, [artist, title]);

    return dom.div({ className: 'tracklist-item' }, [playBtn, desc]);
  },

  togglePlay: function () {
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }
});