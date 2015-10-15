import React from 'react';
import { Motion, spring } from 'react-motion';
import Icon from 'app/ui/icon';
import cx from 'classnames';
import updateOnKey from 'app/fn/updateOnKey';
import { hasTag } from 'app/Tag';

var PlayBtn = React.createClass({
  render: function () {
    var classes = cx({
      'play-btn': true,
      'play-btn--active': this.props.isPlaying
    });

    var isCmdActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');

    return (
      <Motion
        defaultStyle={{
          rotate: 0,
          opacity: 100
        }}

        style={{
          rotate: spring(this.props.isPlaying ? 90 : 0, [160, 17]),
          opacity: spring(isCmdActivated ? 0 : 100)
        }}>
        {interpolated =>
          <div key='play-btn' className={classes} onClick={this.props.onClick} style={{ transform: `rotate(${interpolated.rotate}deg)`, opacity: `${interpolated.opacity / 100}` }}>
            <Icon id={this.props.isPlaying ? 'shape-pause' : 'shape-iconmonstr-arrow-37-icon'}></Icon>
          </div>
        }
      </Motion>
    );
  }
});

export default updateOnKey(PlayBtn, ':db/command-palette');
