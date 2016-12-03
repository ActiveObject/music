import React from 'react';
import { connect } from 'react-redux';
import { togglePlay } from 'app/effects';
import { Effect } from 'app/shared/effects';
import PlayBtn from './PlayBtn';

const PlayBtnCtrl = ({ isPlaying }) =>
  <Effect>
    {run =>
      <div style={{position: 'fixed', left: 0, bottom: 0, padding: '20px 30px'}}>
        <PlayBtn isPlaying={isPlaying} onClick={() => run(togglePlay())} />
      </div>
    }
  </Effect>

export default connect(state => ({
  isPlaying: state[':player/isPlaying']
}))(PlayBtnCtrl);
