import React from 'react';
import { connect } from 'react-redux';

import { hasTag } from 'app/shared/Tag';
import { togglePlay } from 'app/playerActions';
import PlayBtn from './PlayBtn';

function PlayBtnCtrl({ player, dispatch }) {
  var isPlaying = hasTag(player, ':player/is-playing');

  return (
    <div className='main-layout__play-btn'>
      <PlayBtn isPlaying={isPlaying} onClick={() => dispatch(togglePlay())} />
    </div>
  );
}

export default connect(state => ({ player: state.player }))(PlayBtnCtrl);
