import React from 'react';
import { connect } from 'react-redux';
import './PlayerView.css';

const PlayerView = ({ track }) =>
  <div className='PlayerView'>
    {track}
  </div>

export default connect(state => ({
  track: state[':player/track']
}))(PlayerView);
