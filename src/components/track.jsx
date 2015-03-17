require('app/styles/track.styl');
require('app/styles/element.styl');

var React = require('react/addons');
var cx = require('classnames');
var duration = require('app/utils/duration');
var PlayBtnCell = require('app/components/play-btn-cell');

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
    var classSet = cx({
      'track': true,
      'track--active': this.props.isActive
    });

    return (
      <div className={classSet}>
        <PlayBtnCell
          isPlaying={this.props.isPlaying}
          isActive={this.props.isActive}
          onClick={v => this.props.onTogglePlay(this.props.track)} />

        <div className='track-title'>{audio.title}</div>
        <div className='track-artist'><span>{audio.artist}</span></div>
        <div className='track-duration'>{duration(audio.duration)}</div>
      </div>
    );
  }
});

module.exports = Track;