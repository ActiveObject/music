import React from 'react';
import ReactDOM from 'react-dom';
import key from 'keymaster';
import { connect } from 'react-redux';
import { AudioProvider } from 'app/shared/Soundmanager';
import './PlayerView.css';
import PlayBtn from 'app/shared/PlayBtn/PlayBtn';

class PlayerPopover extends React.Component {
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
    var { track, audio } = this.props;
    var artist = track && track.artist;
    var title = track && track.title;

    return (
      <div className='PlayerView'>
        <div className='PlayerView__top'>
          <div className='PlayerView__visualization'>
            <FrequencyBar audio={audio} width={360} height={150} />
          </div>
          <div className='PlayerView__audio'></div>
        </div>

        <div className='PlayerView__info'>
          <div className='PlayerView__artist'>{artist}</div>
          <div className='PlayerView__title'>{title}</div>
        </div>

        <div style={{ position: 'absolute', top: 400, left: 0, width: '100%', height: 100, backgroundColor: 'white'}}></div>
      </div>
    )
  }
}

class PlayerView extends React.Component {
  constructor() {
    super();
    this.state = { shape: 'button' };
  }

  render() {
    return (
      <AudioProvider>
        {audio => this.renderChildren(audio) }
      </AudioProvider>
    )
  }

  renderChildren(audio) {
    if (this.state.shape === 'button') {
      return (
        <div style={{position: 'fixed', left: 0, bottom: 0, padding: '20px 30px'}}>
          <PlayBtn isPlaying={this.props.isPlaying} onClick={() => this.setState({ shape: 'popover' })} />
        </div>
      );
    }

    return <PlayerPopover track={this.props.track} audio={audio} onHide={() => this.setState({ shape: 'button' })} />
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
    this.disconnect && this.disconnect();
    this.connect(audio);
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

export default connect(state => ({
  track: state[':player/track'],
  isPlaying: state[':player/isPlaying']
}))(PlayerView);
