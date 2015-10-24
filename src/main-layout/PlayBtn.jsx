import React from 'react';
import { Motion, spring } from 'react-motion';
import Icon from 'app/ui/icon';
import cx from 'classnames';
import { hasTag } from 'app/Tag';

import './play-btn.css';
import pauseSvg from './pause.svg';
import playSvg from './play.svg';

export default function PlayBtn({ isPlaying, onClick }) {
  var classes = cx({
    'play-btn': true,
    'play-btn--active': isPlaying
  });

  return (
    <Motion
      defaultStyle={{ rotate: 0 }}
      style={{ rotate: spring(isPlaying ? 90 : 0, [160, 17]) }}>
      {interpolated =>
        <div key='play-btn' className={classes} onClick={onClick} style={{ transform: `rotate(${interpolated.rotate}deg)` }}>
          <Icon id={isPlaying ? pauseSvg : playSvg } />
        </div>
      }
    </Motion>
  );
}
