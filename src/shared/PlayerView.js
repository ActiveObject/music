import React from 'react';
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
  render() {
    return <canvas />;
  }
}

export default connect(state => ({
  track: state[':player/track']
}))(PlayerView);
