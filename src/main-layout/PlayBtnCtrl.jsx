import React from 'react';
import db from 'app/db';
import vbus from 'app/vbus';
import { hasTag } from 'app/Tag';
import updateOnKey from 'app/updateOnKey';
import * as Player from 'app/Player';
import PlayBtn from './PlayBtn';

function PlayBtnCtrl() {
  var isPlaying = hasTag(db.value.get(':db/player'), ':player/is-playing');
  return <PlayBtn isPlaying={isPlaying} onClick={togglePlay} />;
}

function togglePlay() {
  vbus.push(Player.togglePlay(db.value.get(':db/player')));
}

export default updateOnKey(PlayBtnCtrl, ':db/player');