import React from 'react';
import { Motion, spring } from 'react-motion';
import app from 'app';
import { hasTag } from 'app/Tag';
import { updateOn } from 'app/renderer';
import * as Player from 'app/Player';
import PlayBtn from './PlayBtn';

const AnimationContainer = updateOn(({ children }) => {
  var isCmdActivated = hasTag(app.value.get(':db/command-palette'), ':cmd/is-activated');

  return (
    <Motion
      defaultStyle={{ opacity: 0 }}
      style={{ opacity: spring(isCmdActivated ? 0 : 100) }} >
      {interpolated =>
        <div className='main-layout__play-btn' style={{ opacity: `${interpolated.opacity / 100}` }}>
          {children}
        </div>
      }
    </Motion>
  );
}, ':db/command-palette');

const PlayBtnCtrl = () => {
  var isPlaying = hasTag(app.value.get(':db/player'), ':player/is-playing');

  return (
    <AnimationContainer>
      <PlayBtn isPlaying={isPlaying} onClick={togglePlay} />
    </AnimationContainer>
  );
}

function togglePlay() {
  app.push(Player.togglePlay(app.value.get(':db/player')));
}

export default updateOn(PlayBtnCtrl, ':db/player');
