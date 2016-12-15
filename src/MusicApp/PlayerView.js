import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import key from 'keymaster';
import './PlayerView.css';
import PlayBtn from './PlayBtn/PlayBtn';
import TracklistTable from 'app/MusicApp/tracklist/TracklistTable';
import LazyTracklist from 'app/MusicApp/tracklist/LazyTracklist';
import { Effect } from 'app/shared/effects';
import { seekTo } from 'app/effects';

class AudioProgressLine extends React.Component {
  static propTypes = {
    audio: PropTypes.instanceOf(HTMLMediaElement).isRequired,
    onSeek: PropTypes.func.isRequired
  }

  state = {
    currentTime: 0,
    duration: 0,
    isSeekIndicatorVisible: false,
    isSeeking: false,
    seekPosition: 0
  }

  onTimeUpdate = () => this.setState({ currentTime: this.props.audio.currentTime })
  onDurationChange = () => this.setState({ duration: this.props.audio.duration })

  componentWillMount() {
    this.setState({
      currentTime: this.props.audio.currentTime,
      duration: this.props.audio.duration
    });
  }

  componentDidMount() {
    this.connect(this.props.audio);
  }

  componentWillUpdate({ audio }) {
    if (audio !== this.props.audio) {
      this.setState({ currentTime: 0 });
    }
  }

  componentDidUpdate({ audio }) {
    if (audio !== this.props.audio) {
      this.disconnect(audio);
      this.connect(this.props.audio);
    }
  }

  componentWillUnmount() {
    this.disconnect(this.props.audio);
  }

  connect(audio) {
    audio.addEventListener('timeupdate', this.onTimeUpdate, false);
    audio.addEventListener('durationchange', this.onDurationChange, false);
  }

  disconnect(audio) {
    audio.removeEventListener('timeupdate', this.onTimeUpdate, false);
    audio.removeEventListener('durationchange', this.onDurationChange, false);
  }

  render() {
    var { currentTime, duration, isSeeking, isSeekIndicatorVisible, seekPosition } = this.state;

    var position = duration > 0 ? currentTime / duration * 100 : 0;

    if (isSeeking) {
      position = seekPosition * 100;
    }

    var style = {
      position: 'relative',
      width: '100%',
      height: 10,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      userSelect: 'none'
    };

    var seekIndicatorStyle = {
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: '50%',
      opacity: isSeekIndicatorVisible || isSeeking ? 1 : 0,
      transition: 'opacity 0.1s',
      marginLeft: -5,
      backgroundColor: 'white',
      left: `${position}%`
    };

    var bgLineStyle = {
      position: 'absolute',
      width: `100%`,
      height: 3,
      backgroundColor: '#FEA5CD'
    };

    var fgLineStyle = {
      position: 'absolute',
      width: `${position}%`,
      height: 3,
      backgroundColor: 'white'
    };

    return (
      <div
        style={style}
        onMouseOver={this.showSeekIndicator}
        onMouseOut={this.hideSeekIndicator}
        onMouseMove={this.moveSeekIndicator}
        onClick={this.seekToPosition}
        onMouseUp={this.stopDragging} >
        <div style={bgLineStyle} />
        <div style={fgLineStyle} />
        <div style={seekIndicatorStyle} onMouseDown={this.startDragging} />
      </div>
    )
  }

  showSeekIndicator = () => this.setState({ isSeekIndicatorVisible: true })
  hideSeekIndicator = () => this.setState({ isSeekIndicatorVisible: false })
  startDragging = event => this.setState({ isSeeking: true, seekPosition: this.relativePosition(event) })
  stopDragging = event => this.setState({ isSeeking: false })

  moveSeekIndicator = event => {
    if (this.state.isSeeking) {
      this.setState({
        seekPosition: this.relativePosition(event)
      });
    }
  }

  seekToPosition = event => {
    this.props.onSeek(this.relativePosition(event));
  }

  relativePosition(event) {
    var node = ReactDOM.findDOMNode(this);
    var lineWidth = node.offsetWidth;
    var leftX = node.getBoundingClientRect().left;
    var position = event.clientX - leftX;

    return position / lineWidth;
  }
}

class Popover extends React.Component {
  componentDidMount() {
    key('esc', this.props.onHide);

    this.removeEventListener = addEventListener(document, 'click', (e) => {
      var { width, height, left, top } = ReactDOM.findDOMNode(this).getBoundingClientRect();
      var isOutsideX = e.clientX < left || e.clientX > (left + width);
      var isOutsideY = e.clientY < top || e.clientY > (top + height);

      if (isOutsideX || isOutsideY) {
        this.props.onHide();
      }
    }, true);
  }

  componentWillUnmount() {
    key.unbind('esc', this.props.onHide);
    this.removeEventListener();
  }

  render() {
    return this.props.children;
  }
}

class PlayerView extends React.Component {
  state = {
    shape: 'button',
    isPlaying: false
  }

  onPaused = () => this.setState({ isPlaying: false })
  onPlaying = () => this.setState({ isPlaying: true })

  componentDidMount() {
    this.connect(this.props.audio);
  }

  componentDidUpdate({ audio }) {
    this.disconnect(audio);
    this.connect(this.props.audio);
  }

  componentWillUnmount() {
    this.disconnect(this.props.audio);
  }

  connect(audio) {
    if (audio) {
      audio.addEventListener('pause', this.onPaused, false);
      audio.addEventListener('play', this.onPlaying, false);
    }
  }

  disconnect(audio) {
    if (audio) {
      audio.removeEventListener('pause', this.onPaused, false);
      audio.removeEventListener('play', this.onPlaying, false);
    }
  }

  render() {
    var { audio, track, playlist } = this.props;
    var { shape, isPlaying } = this.state;

    if (shape == 'button') {
      return (
        <div style={{position: 'fixed', left: 0, bottom: 0, padding: '20px 30px'}}>
          <PlayBtn isPlaying={isPlaying} onClick={() => this.setState({ shape: 'popover' })} />
        </div>
      );
    }

    var artist = track && track.artist;
    var title = track && track.title;

    return (
      <Popover onHide={() => this.setState({ shape: 'button' })}>
        <div className='PlayerView'>
          <div className='PlayerView-b'>
            <div className='PlayerView__top'>
              <div className='PlayerView__visualization'>
                <FrequencyBar audio={audio} width={460} height={150} />
              </div>
              <div className='PlayerView__audio'></div>
            </div>

            <div className='PlayerView__info'>
              <div className='PlayerView__artist'>{artist}</div>
              <div className='PlayerView__title'>{title}</div>
            </div>

            <div style={{ width: '100%', padding: '20px' }}>
              <Effect children={run => <AudioProgressLine audio={audio} onSeek={position => run(seekTo(position))} />} />
            </div>

            <div style={{ position: 'absolute', top: 400, left: 0, width: '100%', height: 300, backgroundColor: 'white', padding: '20px'}}>
              <TracklistTable>
                <LazyTracklist tracks={playlist} audio={audio} currentTrack={track} />
              </TracklistTable>
            </div>
          </div>
        </div>
      </Popover>
    );
  }
}

const AUDIO_CTX = new (window.AudioContext || window.webkitAudioContext)();
const MEDIA_ELEMENT_SOURCES = new WeakMap();

class FrequencyBar extends React.Component {
  componentWillMount() {
    this.analyser = AUDIO_CTX.createAnalyser();
    this.analyser.minDecibels = -80;
    this.analyser.maxDecibels = -20;
    this.analyser.smoothingTimeConstant = 0.85;
    this.analyser.fftSize = 256;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.connect(this.props.audio);
  }

  componentDidMount() {
    this.draw();
  }

  componentWillUpdate({ audio }) {
    if (this.props.audio !== audio) {
      this.disconnect && this.disconnect();
      this.connect(audio);
    }
  }

  componentWillUnmount() {
    this.disconnect && this.disconnect();
    window.cancelAnimationFrame(this.drawVisual);
  }

  connect(audio) {
    console.log('[FrequencyBar] connect');
    var source;

    if (MEDIA_ELEMENT_SOURCES.has(audio)) {
      source = MEDIA_ELEMENT_SOURCES.get(audio);
    } else {
      source = AUDIO_CTX.createMediaElementSource(audio);
      source.connect(AUDIO_CTX.destination)
      MEDIA_ELEMENT_SOURCES.set(audio, source);
    }

    source.connect(this.analyser);

    this.disconnect = function () {
      console.log('[FrequencyBar] disconnect');
      source.disconnect(this.analyser);
    };
  }

  draw() {
    var ctx = ReactDOM.findDOMNode(this).getContext('2d');
    var { width, height } = this.props;
    this.drawVisual = requestAnimationFrame(this.draw.bind(this));
    this.analyser.getByteFrequencyData(this.dataArray);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#FD76B3';
    ctx.fillRect(0, 0, width, height);

    var barWidth = Math.floor(width / this.bufferLength);
    var barHeight;
    var x = 0;
    var y = 0;
    var size = barWidth;
    var margin = 2;

    for(var i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i] / 4;

      for (var j = 0, count = Math.floor(barHeight / (size + margin)); j < count; j++) {
        ctx.fillStyle = '#df699e';
        y = j * (size + margin);
        ctx.fillRect(x, height / 2 - y, barWidth, size);
        ctx.fillRect(x, height / 2 + y, barWidth, size);
      }

      x += barWidth + margin;
    }
  }

  render() {
    return <canvas width={this.props.width} height={this.props.height} />;
  }
}

function addEventListener(el, eventName, listener, isCapture) {
  el.addEventListener(eventName, listener, isCapture);

  return function () {
    el.removeEventListener(eventName, listener, isCapture);
  };
}

export default PlayerView;
