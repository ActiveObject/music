import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { AudioProvider } from 'app/shared/Soundmanager';
import './PlayerView.css';

const PlayerView = ({ track }) =>
  <div className='PlayerView'>
    <div className='PlayerView__top'>
      <div className='PlayerView__visualization'>
        <AudioProvider>
          {audio => <FrequencyBar audio={audio} width={400} height={150} />}
        </AudioProvider>
      </div>
      <div className='PlayerView__audio'></div>
    </div>
  </div>

class FrequencyBar extends React.Component {
  componentWillMount() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
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
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    var barWidth = (width / this.bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for(var i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i]/2;

      ctx.fillStyle = '#f2f2f2';
      ctx.fillRect(x, height / 2 - barHeight / 2, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  render() {
    return <canvas width={this.props.width} height={this.props.height} />;
  }
}

export default connect(state => ({
  track: state[':player/track']
}))(PlayerView);
