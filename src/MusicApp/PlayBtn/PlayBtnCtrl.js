import React from 'react';
import { connect } from 'react-redux';
import { togglePlay } from 'app/shared/redux';
import PlayBtn from './PlayBtn';

const PlayBtnCtrl = ({ isPlaying, dispatch }) =>
  <div style={{position: 'fixed', left: 0, bottom: 0, padding: '20px 30px'}}>
    <PlayBtn isPlaying={isPlaying} onClick={() => dispatch(togglePlay())} />
  </div>

export default connect(state => ({
  isPlaying: state[':player/isPlaying']
}))(PlayBtnCtrl);