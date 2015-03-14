require('app/styles/tracklist.styl');

var React = require('react');
var vbus = require('app/core/vbus');
var Track = require('app/components/track');

var Tracklist = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired,
    tracklist: React.PropTypes.object.isRequired
  },

  render: function() {
    var tracks = this.props.tracklist.playlist.tracks.map(function (track) {
      var isActive = track.id === this.props.player.track.id;
      var isPlaying = isActive && this.props.player.isPlaying;

      return (
        <Track
          key={track.id}
          track={track}
          tracklist={this.props.tracklist}
          isActive={isActive}
          isPlaying={isPlaying}
          onTogglePlay={this.togglePlay} />
      );
    }, this);

    return (
      <div className='tracklist'>
        <div className='tracklist-body'>{tracks}</div>
      </div>
    );
  },

  togglePlay: function (track) {
    vbus.push(this.props.player.togglePlay(track, this.props.tracklist));
  }
});

module.exports = Tracklist;
