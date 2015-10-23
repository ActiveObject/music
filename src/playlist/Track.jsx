import React from 'react';
import cx from 'classnames';
import duration from 'app/fn/duration';
import './track.css';

var Track = React.createClass({
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
      <div className={classSet} onClick={() => this.props.onTogglePlay(this.props.track)}>
        <div className='track__index'>{audio.index + 1}</div>
        <div className='track__artist'>{audio.artist}</div>
        <div className='track__title'>{audio.title}</div>
        <div className='track__duration'>{duration(audio.duration)}</div>
      </div>
    );
  }
});

export default Track;