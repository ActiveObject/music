require('app/styles/audio-progress-line.styl');

var React = require('react');
var dom = require('app/core/dom');
var eventBus = require('app/core/event-bus');

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
    var bgLine = dom.div().className('apl-bg-line');

    var loadLine = dom.div().className('apl-load-line')
      .attr('style', { width: this.trackLoaded() + '%' });

    var fgLine = dom.div().className('apl-fg-line')
      .attr('style', { width: this.trackProgress() + '%' });

    var seek = dom.div()
      .className('apl-seek')
      .className('apl-seek-hidden', !this.state.seekIsVisible)
      .attr('onMouseDown', this.dragStart)
      .attr('style', { left: this.trackProgress() + '%' });

    return dom.div()
      .className('apl')
      .className('apl-seek-active', this.props.track.seeking)
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
    if (!this.props.track.seeking) {
      this.setState({ seekIsVisible: false });
    }
  },

  dragStart: function (e) {
    this.setState({ seekStart: e.clientX });
    eventBus.startSeeking();
  },

  dragEnd: function (e) {
    if (this.props.track.seeking) {
      eventBus.seekAudioApply();
      this.setState({ seekStart: 0 });
    }
  },

  moveSeekIndicator: function (e) {
    if (this.props.track.seeking) {
      eventBus.seekAudio(this.seekPosition(e.clientX) / 100);
    }
  },

  seekPosition: function (seekCurrent) {
    var offset = seekCurrent - this.state.seekStart,
        lw = this.lineWidth(),
        trp = (this.state.seekStart - this.leftX()) / lw * 100,
        poffset = offset / lw * 100,
        p = (trp + poffset);

    if (p < 0) {
      return 0;
    }

    if (p > 100) {
      return 100;
    }

    return p;
  },

  seekToPosition: function (e) {
    eventBus.seekAudio(this.seekPosition(e.clientX) / 100);
    eventBus.seekAudioApply();
  },

  trackProgress: function () {
    return this.props.track.relativePosition() * 100;
  },

  trackLoaded: function () {
    return this.props.track.relativeLoaded() * 100;
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