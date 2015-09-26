import React from 'react';
import { Spring } from 'react-motion';
import Icon from 'app/ui/icon';
import cx from 'classnames';

var PlayBtn = React.createClass({
  render: function () {
    var classes = cx({
      'play-btn': true,
      'play-btn--active': this.props.isPlaying
    });

    return (
      <Spring
        defaultValue={{ rotate: { val: 0 }}}
        endValue={{ rotate: { val: this.props.isPlaying ? 90 : 0, config: [160, 17] }}} >
        {interpolated =>
          <div key='play-btn' className={classes} onClick={this.props.onClick} style={{ transform: `rotate(${interpolated.rotate.val}deg)` }}>
            <Icon id={this.props.isPlaying ? 'shape-pause' : 'shape-iconmonstr-arrow-37-icon'}></Icon>
          </div>
        }
      </Spring>
    );
  }
});

module.exports = PlayBtn;
