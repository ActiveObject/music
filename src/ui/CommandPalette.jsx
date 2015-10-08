import React from 'react';
import { Spring } from 'react-motion';
import { throttle } from 'underscore';
import db from 'app/db';
import vbus from 'app/core/vbus';
import { hasTag } from 'app/Tag';
import updateOnKey from 'app/fn/updateOnKey';

var CommandPalette = React.createClass({
  componentDidUpdate: function () {
    var isActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');

    if (isActivated && document.activeElement !== this._input) {
      this._input.select();
    }
  },

  render: function () {
    var cmd = db.value.get(':db/cmd');
    var isActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');

    return (
      <Spring
        defaultValue={{
          fontSize: { val: 2 },
          y: { val: 0 }
        }}

        endValue={{
          fontSize: { val: isActivated ? 3 : 2 },
          y: { val: isActivated ? 100 : 0 }
        }}>
        {interpolated =>
          <div
              className='command-palette'
              style={{
                transform: `translate(0, ${interpolated.y.val}px)`,
                fontSize: `${interpolated.fontSize.val}rem`
              }} >
            <input
              ref={(c) => this._input = c}
              type='text'
              className='command-palette__input'
              value={cmd}
              onFocus={this.activate}
              onBlur={this.deactivate}
              onChange={throttle((e) => this.executeCommand(e.target.value), 200)} />
            <div className='command-palette__complete'>
              <span>All tracks</span>
              <span className='command-palette__todo'>{' #breaks'}</span>
            </div>
          </div>
        }
      </Spring>
    );
  },

  executeCommand: function (cmd) {
    vbus.emit({
      tag: ':app/cmd',
      value: cmd
    });
  },

  activate: function () {
    vbus.emit({
      tag: [':app/command-palette', ':cmd/is-activated']
    });
  },

  deactivate: function () {
    vbus.emit({
      tag: [':app/command-palette']
    });
  }
});

export default updateOnKey(CommandPalette, [':db/command-palette', ':db/cmd']);
