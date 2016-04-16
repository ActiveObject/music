import React from 'react';
import { Motion, spring } from 'react-motion';
import Icon from 'app/Icon';
import cx from 'classnames';
import { hasTag } from 'app/Tag';

import './PlayBtn.css';
import pauseSvg from './pause.svg';
import playSvg from './play.svg';

const PlayBtn = ({ isPlaying, onClick }) => {
  var classes = cx({
    'play-btn': true,
    'play-btn--active': isPlaying
  });

  return (
    <Motion
      defaultStyle={{ rotate: 0 }}
      style={{ rotate: spring(isPlaying ? 90 : 0, { stiffness: 160, damping: 17 }) }}>
      {interpolated =>
        <div key='play-btn' className={classes} onClick={onClick} style={{ transform: `rotate(${interpolated.rotate}deg)` }}>
          <Icon id={isPlaying ? pauseSvg : playSvg } />
        </div>
      }
    </Motion>
  );
}

export default PlayBtn;
