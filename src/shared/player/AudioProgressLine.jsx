import React from 'react';
import classnames from 'classnames';
import app from 'app';
import * as Player from 'app/shared/Player';
import { hasTag } from 'app/shared/Tag';
import subscribeWith from 'app/shared/subscribeWith';
import './AudioProgressLine.css';

class AudioProgressLine extends React.Component {
  constructor() {
    super();
    this.state = {
      seekStart: 0,
      seekIsVisible: false
    }
  }

  componentDidMount() {
    this.unsub = subscribeWith(addListener, addListener => {
      addListener(document, 'mousemove', (e) => this.moveSeekIndicator(e), false);
      addListener(document, 'mouseup', (e) => this.dragEnd(e), false);
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  render() {
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
        onMouseOver={e => this.showSeekIndicator(e)}
        onMouseOut={e => this.hideSeekIndicator(e)}
        onMouseLeave={e => this.moveSeekIndicator(e)}
        onClick={e => this.seekToPosition(e)} >

        <div className='apl-bg-line' />
        <div className='apl-load-line' style={{ width: this.trackLoaded() + '%' }} />
        <div className='apl-fg-line' style={{ width: this.trackProgress() + '%' }} />
        <div className={seekClassName} onMouseDown={e => this.dragStart(e)} style={{ left: this.trackProgress() + '%' }} />
      </div>
    );
  }

  showSeekIndicator(e) {
    e.stopPropagation();
    this.setState({ seekIsVisible: true });
  }

  hideSeekIndicator(e) {
    e.stopPropagation();
    if (!hasTag(this.props.player, ':player/seeking')) {
      this.setState({ seekIsVisible: false });
    }
  }

  dragStart(e) {
    this.setState({ seekStart: e.clientX });
    app.push(Player.startSeeking(this.props.player));
  }

  dragEnd(e) {
    if (hasTag(this.props.player, ':player/seeking')) {
      this.setState({ seekStart: 0 });
      app.push(Player.stopSeeking(this.props.player));
    }
  }

  moveSeekIndicator(e) {
    if (hasTag(this.props.player, ':player/seeking')) {
      app.push(Player.seek(this.props.player, this.seekPosition(e.clientX)));
    }
  }

  seekPosition(seekCurrent) {
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
  }

  seekToPosition(e) {
    app.push(Player.seekTo(this.props.player, this.seekPosition(e.clientX)));
  }

  trackProgress() {
    if (hasTag(this.props.player, ':player/seeking')) {
      return Player.relativeSeekPosition(this.props.player) * 100;
    } else {
      return Player.relativePosition(this.props.player) * 100;
    }
  }

  trackLoaded() {
    return Player.relativeLoaded(this.props.player) * 100;
  }

  lineWidth() {
    if (this.refs.progressLine) {
      return this.refs.progressLine.offsetWidth;
    }

    return 0;
  }

  leftX() {
    if (this.refs.progressLine) {
      return this.refs.progressLine.getBoundingClientRect().left;
    }

    return 0;
  }
}

function addListener(target, type, listener, useCapture) {
  target.addEventListener(type, listener, useCapture);

  return function () {
    target.removeEventListener(type, listener, useCapture);
  };
}

export default AudioProgressLine;
