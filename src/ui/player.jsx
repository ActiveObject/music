require('app/styles/active-track.styl');
require('app/styles/play-btn.styl');

var React = require('react');
var vbus = require('app/core/vbus');
var PlayBtn = require('app/ui/play-btn');
var AudioProgressLine = require('app/ui/audio-progress-line');
var formatDuration = require('app/fn/duration');
var hasTag = require('app/fn/hasTag');
var Player = require('app/values/player');

module.exports = React.createClass({
  render: function() {
    var track = {
      title: this.props.player.track.audio.title,
      artist: this.props.player.track.audio.artist,
      duration: formatDuration(this.props.player.track.audio.duration),
      position: formatDuration(Math.floor(this.props.player.position / 1000))
    };

    return (
      <div className='active-track'>
        <div className='player-body'>
          <PlayBtn
            isActive={true}
            isPlaying={hasTag(this.props.player, ':player/is-playing')}
            onClick={this.togglePlay} />

          <div className='active-track-desc' title={[track.artist, track.title].join(' – ')} >
            <span className='active-track-artist'>{track.artist}</span>
            <span className='active-track-separator'>-</span>
            <span className='active-track-title'>{track.title}</span>
          </div>

          <span className='active-track-time'>
            <span className='active-track-position'>{track.position}</span>
            <span>/</span>
            <span className='active-track-duration'>{track.duration}</span>
          </span>

          <div className='active-track-progress'>
            <AudioProgressLine player={this.props.player} />
          </div>
        </div>
      </div>
    )
  },

  togglePlay: function () {
    vbus.emit(Player.togglePlay(this.props.player));
  }
});
