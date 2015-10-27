import React from 'react';
import app from 'app';
import { hasTag } from 'app/Tag';
import { updateOn } from 'app/renderer';
import * as Player from 'app/Player';
import PlayBtn from './PlayBtn';

function PlayBtnCtrl() {
  var isPlaying = hasTag(app.value.get(':db/player'), ':player/is-playing');
  return <PlayBtn isPlaying={isPlaying} onClick={togglePlay} />;
}

function togglePlay() {
  app.push(Player.togglePlay(app.value.get(':db/player')));
}

export default updateOn(PlayBtnCtrl, ':db/player');