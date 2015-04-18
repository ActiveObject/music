require('app/styles/audio-progress-line.styl');

var React = require('react');
var dom = require('app/core/dom');
var vbus = require('app/core/vbus');

var AudioProgressLine = React.createClass({
  displayName: 'AudioProgressLine',

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
    var bgLine = dom.div()
      .key('apl-bg-line')
      .className('apl-bg-line');

    var loadLine = dom.div()
      .key('apl-load-line')
      .className('apl-load-line')
      .attr('style', { width: this.trackLoaded() + '%' });

    var fgLine = dom.div()
      .key('apl-fg-line')
      .className('apl-fg-line')
      .attr('style', { width: this.trackProgress() + '%' });

    var seek = dom.div()
      .key('apl-seek')
      .className('apl-seek')
      .className('apl-seek-hidden', !this.state.seekIsVisible)
      .attr('onMouseDown', this.dragStart)
      .attr('style', { left: this.trackProgress() + '%' });

    return dom.div()
      .className('apl')
      .className('apl-seek-active', this.props.player.seeking)
      .append(bgLine, loadLine, fgLine, seek)
      .attr('ref', 'progressLine')
      .attr('onMouseOver', this.showSeekIndicator)
      .attr('onMouseOut', this.hideSeekIndicator)
      .attr('onMouseLeave', this.moveSeekIndicator)
      .attr('onClick', this.seekToPosition)
      .make();
  },

  showSeekIndicator: function (e) {
    e.stopPropagation();
    this.setState({ seekIsVisible: true });
  },

  hideSeekIndicator: function (e) {
    e.stopPropagation();
    if (!this.props.player.seeking) {
      this.setState({ seekIsVisible: false });
    }
  },

  dragStart: function (e) {
    this.setState({ seekStart: e.clientX });
    vbus.emit(this.props.player.startSeeking());
  },

  dragEnd: function (e) {
    if (this.props.player.seeking) {
      this.setState({ seekStart: 0 });
      vbus.emit(this.props.player.stopSeeking());
    }
  },

  moveSeekIndicator: function (e) {
    if (this.props.player.seeking) {
      vbus.emit(this.props.player.seek(this.seekPosition(e.clientX)));
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
    vbus.emit(this.props.player.seekTo(this.seekPosition(e.clientX)));
  },

  trackProgress: function () {
    if (this.props.player.seeking) {
      return this.props.player.relativeSeekPosition() * 100;
    } else {
      return this.props.player.relativePosition() * 100;
    }
  },

  trackLoaded: function () {
    return this.props.player.relativeLoaded() * 100;
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

module.exports = AudioProgressLine;
