require('app/styles/tracklist.styl');

var React = require('react');
var vbus = require('app/core/vbus');
var Track = require('app/ui/track');

var Tracklist = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired,
    tracklist: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      count: 5,
      step: 5
    };
  },

  render: function() {
    var tracks = this.props.tracklist.playlist.tracks.slice(0, this.state.count).map(function (track) {
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
        <div className='tracklist-more' onClick={this.next}>next {this.state.step}</div>
      </div>
    );
  },

  togglePlay: function (track) {
    vbus.emit(this.props.player.togglePlay(track, this.props.tracklist));
  },

  next: function() {
    this.setState({
      count: this.state.count + this.state.step,
      step: this.state.count > 5 ? 10 : this.state.count
    });
  }
});

module.exports = Tracklist;
