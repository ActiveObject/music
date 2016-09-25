import React from 'react';
import { connect } from 'react-redux';
import './PlayerView.css';

const PlayerView = ({ track }) =>
  <div className='PlayerView'>
    <div className='PlayerView__top'>
      <div className='PlayerView__visualization'>
        <FrequencyBar width={400} height={150} />
      </div>
      <div className='PlayerView__audio'></div>
    </div>
  </div>

class FrequencyBar extends React.Component {
  componentWillMount() {

  }

  render() {
    return <canvas />;
  }
}

export default connect(state => ({
  track: state[':player/track']
}))(PlayerView);
