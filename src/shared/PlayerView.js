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
  }

  componentWillUnmount() {
    key.unbind('esc', this.props.onHide);
  }

  render() {
    var { track, onHide } = this.props;
    var artist = track && track.artist;
    var title = track && track.title;

    return (
      <div className='PlayerView' onClick={onHide}>
        <div className='PlayerView__top'>
          <div className='PlayerView__visualization'>
            <AudioProvider>
              {audio => <FrequencyBar audio={audio} width={360} height={150} />}
            </AudioProvider>
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
    if (this.state.shape === 'button') {
      return (
        <div style={{position: 'fixed', left: 0, bottom: 0, padding: '20px 30px'}}>
          <PlayBtn isPlaying={this.props.isPlaying} onClick={() => this.setState({ shape: 'popover' })} />
        </div>
      );
    }

    return <PlayerPopover track={this.props.track} onHide={() => this.setState({ shape: 'button' })} />
  }
}

class FrequencyBar extends React.Component {
  componentWillMount() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.minDecibels = -80;
    this.analyser.maxDecibels = -20;
    this.analyser.smoothingTimeConstant = 0.85;
    this.analyser.fftSize = 256;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.analyser.connect(this.audioCtx.destination);

    if (this.props.audio) {
      this.connect(this.props.audio);
    }
  }

  componentWillUpdate({ audio }) {
    if (this.props.audio) {
      this.disconnect && this.disconnect();
      this.connect(audio);
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.drawVisual);
  }

  connect(audio) {
    console.log('[FrequencyBar] connect');
    var source = this.audioCtx.createMediaElementSource(audio);
    source.connect(this.analyser);

    this.disconnect = function () {
      source.disconnect(this.analyser);
    };

    this.draw();
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

export default connect(state => ({
  track: state[':player/track'],
  isPlaying: state[':player/isPlaying']
}))(PlayerView);
