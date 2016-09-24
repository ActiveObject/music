import React from 'react';
import { connect } from 'react-redux';
import { hasTag } from 'app/shared/Tag';
import { togglePlay } from 'app/playerActions';
import PlayBtn from './PlayBtn';

const PlayBtnCtrl = ({ player, dispatch }) =>
  <div style={{position: 'fixed', left: 0, bottom: 0, padding: '20px 30px'}}>
    <PlayBtn isPlaying={hasTag(player, ':player/is-playing')} onClick={() => dispatch(togglePlay())} />
  </div>

export default connect(state => ({ player: state.player }))(PlayBtnCtrl);
