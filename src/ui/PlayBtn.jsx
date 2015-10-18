import React from 'react';
import { Motion, spring } from 'react-motion';
import Icon from 'app/ui/icon';
import cx from 'classnames';
import { hasTag } from 'app/Tag';

var PlayBtn = React.createClass({
  render: function () {
    var classes = cx({
      'play-btn': true,
      'play-btn--active': this.props.isPlaying
    });

    return (
      <Motion
        defaultStyle={{ rotate: 0 }}
        style={{ rotate: spring(this.props.isPlaying ? 90 : 0, [160, 17]) }}>
        {interpolated =>
          <div key='play-btn' className={classes} onClick={this.props.onClick} style={{ transform: `rotate(${interpolated.rotate}deg)` }}>
            <Icon id={this.props.isPlaying ? 'shape-pause' : 'shape-iconmonstr-arrow-37-icon'} />
          </div>
        }
      </Motion>
    );
  }
});

export default PlayBtn;
