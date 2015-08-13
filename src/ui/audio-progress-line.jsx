require('app/styles/audio-progress-line.styl');

var React = require('react');
var vbus = require('app/core/vbus');
var Player = require('app/values/player');
var hasTag = require('app/fn/hasTag');
var classnames = require('classnames');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      seekStart: 0,
      seekIsVisible: false
    };
  },

  componentDidMount: function () {
    document.addEventListener('mousemove', this.moveSeekIndicator, false);
    document.addEventListener('mouseup', this.dragEnd, false);
  },

  componentWillUnmount: function () {
    document.removeEventListener('mousemove', this.moveSeekIndicator, false);
    document.removeEventListener('mouseup', this.dragEnd, false);
  },

  render: function () {
    var progressLineClassName = classnames({
      'apl': true,
      'apl-seek-active': hasTag(this.props.player, ':player/seeking')
    });

    var seekClassName = classnames({
      'apl-seek': true,
      'apl-seek-hidden': !this.state.seekIsVisible
    });

    return (
      <div
        className={progressLineClassName}
        ref='progressLine'
        onMouseOver={this.showSeekIndicator}
        onMouseOut={this.hideSeekIndicator}
        onMouseLeave={this.moveSeekIndicator}
        onClick={this.seekToPosition} >

        <div className='apl-bg-line' />
        <div className='apl-load-line' style={{ width: this.trackLoaded() + '%' }} />
        <div className='apl-fg-line' style={{ width: this.trackProgress() + '%' }} />
        <div className={seekClassName} onMouseDown={this.dragStart} style={{ left: this.trackProgress() + '%' }} />
      </div>
    );
  },

  showSeekIndicator: function (e) {
    e.stopPropagation();
    this.setState({ seekIsVisible: true });
  },

  hideSeekIndicator: function (e) {
    e.stopPropagation();
    if (!hasTag(this.props.player, ':player/seeking')) {
      this.setState({ seekIsVisible: false });
    }
  },

  dragStart: function (e) {
    this.setState({ seekStart: e.clientX });
    vbus.emit(Player.startSeeking(this.props.player));
  },

  dragEnd: function (e) {
    if (hasTag(this.props.player, ':player/seeking')) {
      this.setState({ seekStart: 0 });
      vbus.emit(Player.stopSeeking(this.props.player));
    }
  },

  moveSeekIndicator: function (e) {
    if (hasTag(this.props.player, ':player/seeking')) {
      vbus.emit(Player.seek(this.props.player, this.seekPosition(e.clientX)));
    }
  },

  seekPosition: function (seekCurrent) {
    var offset = seekCurrent - this.state.seekStart,
        lw = this.lineWidth(),
        trp = (this.state.seekStart - this.leftX()) / lw,
        poffset = offset / lw,
        p = (trp + poffset);

    if (p < 0) {
      return 0;
    }

    if (p > 1) {
      return 1;
    }

    return p;
  },

  seekToPosition: function (e) {
    vbus.emit(Player.seekTo(this.props.player, this.seekPosition(e.clientX)));
  },

  trackProgress: function () {
    if (hasTag(this.props.player, ':player/seeking')) {
      return Player.relativeSeekPosition(this.props.player) * 100;
    } else {
      return Player.relativePosition(this.props.player) * 100;
    }
  },

  trackLoaded: function () {
    return Player.relativeLoaded(this.props.player) * 100;
  },

  lineWidth: function () {
    if (this.refs.progressLine) {
      return this.refs.progressLine.getDOMNode().offsetWidth;
    }

    return 0;
  },

  leftX: function () {
    if (this.refs.progressLine) {
      return this.refs.progressLine.getDOMNode().getBoundingClientRect().left;
    }

    return 0;
  }
});
