require('app/styles/track.styl');
require('app/styles/element.styl');

var React = require('react/addons');
var duration = require('app/utils/duration');
var PlayBtn = require('app/components/play-btn');

var Track = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    tracklist: React.PropTypes.object.isRequired,
    track: React.PropTypes.object.isRequired,
    onTogglePlay: React.PropTypes.func.isRequired,
    isPlaying: React.PropTypes.bool,
    isActive: React.PropTypes.bool
  },

  getInitialProps: function () {
    return {
      isPlaying: false,
      isActive: false
    };
  },

  render: function() {
    var audio = this.props.track.audio;

    return (
      <div className='track'>
        <PlayBtn
          isPlaying={this.props.isPlaying}
          isActive={this.props.isActive}
          onClick={v => this.props.onTogglePlay(this.props.track)} />

        <div className='track-desc' title={`${audio.artist} - ${audio.title}`}>
          <a className='element-link track-artist' href={`/artist/${audio.artist}`}>{audio.artist}</a>
          <div className='track-title'>{audio.title}</div>
        </div>

        <div className='track-duration'>{duration(audio.duration)}</div>
      </div>
    );
  }
});

module.exports = Track;