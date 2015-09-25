var React = require('react/addons');
var cx = require('classnames');
var duration = require('app/fn/duration');
var PlayBtnCell = require('app/ui/play-btn-cell');

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
        <div className='track__index'>{audio.index + 1}</div>
        <div className='track__artist'>{audio.artist}</div>
        <div className='track__title'>{audio.title}</div>
        <div className='track__duration'>{duration(audio.duration)}</div>
      </div>
    );
  }
});

module.exports = Track;