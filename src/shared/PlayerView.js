import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TransitionMotion, spring } from 'react-motion';
import key from 'keymaster';
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
    var { track, audio, x, y, width, height } = this.props;
    var artist = track && track.artist;
    var title = track && track.title;
    var vOffset = Math.floor((500 - height) / 2);
    var hOffset = Math.floor((400 - width) / 2);
    var WebkitClipPath = `inset(${vOffset}px ${hOffset}px)`;
    var newY = y + Math.sin(Math.PI * y / 230) * y * 0.5;

    return (
      <div className='PlayerView' style={{ transform: `translate(${x}px, ${newY}px)`, WebkitClipPath }}>
        <div className='PlayerView-b'>
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
      </div>
    )
  }
}

class PlayerAnimation extends Component {
  render() {
    return (
      <TransitionMotion
        styles={this.getStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
        children={this.props.children} />
    );
  }

  getStyles(v) {
    if (this.props.shape === 'button') {
      return [{
        key: 'button',
        style: {
          x: 0,
          y: 0
        }
      }];
    }

    return [{
      key: 'popover',
      style: {
        x: spring(0, { stiffness: 100, damping: 25 }),
        y: spring(0, { stiffness: 100, damping: 25 }),
        width: spring(400, { stiffness: 300, damping: 25 }),
        height: spring(500, { stiffness: 300, damping: 25 })
      }
    }]
  }

  willLeave(v) {
    if (v.key === 'button') {
      return null;
    }

    return {
      x: spring(-180, { stiffness: 300, damping: 25 }),
      y: spring(230, { stiffness: 300, damping: 25 }),
      width: spring(30, { stiffness: 300, damping: 25 }),
      height: spring(30, { stiffness: 300, damping: 25 })
    };
  }

  willEnter(v) {
    if (v.key === 'button') {
      return null;
    }

    return {
      x: -180,
      y: 230,
      width: 30,
      height: 30
    };
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
    return (
      <PlayerAnimation shape={this.state.shape}>
        {interpolated => {
          if (interpolated.length === 0) {
            return null;
          }

          var result = [];

          interpolated.forEach(({ key, style }) => {
            if (key === 'button') {
              result.push(
                <div key={key} style={{position: 'fixed', left: 0, bottom: 0, padding: '20px 30px'}}>
                  <PlayBtn isPlaying={this.props.isPlaying} onClick={() => this.setState({ shape: 'popover' })} />
                </div>
              );
            }

            if (key === 'popover') {
              result.push (
                <PlayerPopover
                  key={key}
                  x={style.x}
                  y={style.y}
                  width={style.width}
                  height={style.height}
                  track={this.props.track}
                  audio={audio}
                  onHide={() => this.setState({ shape: 'button' })} />
              );
            }
          })

          return <div>{result}</div>;
        }}
      </PlayerAnimation>
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
