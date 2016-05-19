import React from 'react';
import app from 'app';
import { hasTag } from 'app/shared/Tag';
import { updateOn } from 'app/AppHost';
import * as Player from 'app/shared/Player';
import PlayBtn from './PlayBtn';

const PlayBtnCtrl = () => {
  var isPlaying = hasTag(app.value.get(':db/player'), ':player/is-playing');

  return (
    <div className='main-layout__play-btn'>
      <PlayBtn isPlaying={isPlaying} onClick={togglePlay} />
    </div>
  );
}

function togglePlay() {
  app.push(Player.togglePlay(app.value.get(':db/player')));
}

export default updateOn(PlayBtnCtrl, ':db/player');
