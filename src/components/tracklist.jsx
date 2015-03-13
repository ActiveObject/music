require('app/styles/tracklist.styl');

var React = require('react');
var Track = require('app/components/track');

var Tracklist = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired,
    tracklist: React.PropTypes.object.isRequired
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return nextProps.player.track.id !== this.props.player.track.id ||
      nextProps.player.isPlaying !== this.props.player.isPlaying ||
      nextProps.tracklist !== this.props.tracklist;
  },

  render: function() {
    var tracks = this.props.tracklist.playlist.tracks.map(function (track) {
      return (
        <Track
          key={track.id}
          track={track}
          player={this.props.player}
          tracklist={this.props.tracklist}
          y={0}></Track>
      );
    }, this);

    return (
      <div className='tracklist'>
        <div className='tracklist-body'>{tracks}</div>
      </div>
    );
  }
});

module.exports = Tracklist;
