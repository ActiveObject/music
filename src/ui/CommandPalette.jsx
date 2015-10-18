import React from 'react';
import { Motion, spring } from 'react-motion';
import { throttle } from 'underscore';
import db from 'app/db';
import vbus from 'app/core/vbus';
import { hasTag } from 'app/Tag';
import updateOnKey from 'app/fn/updateOnKey';

class CommandPalette extends React.Component {
  componentDidUpdate() {
    var isActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');

    if (isActivated && document.activeElement !== this._input) {
      this._input.select();
    }
  }

  render() {
    var cmd = db.value.get(':db/cmd');
    var isActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');

    return (
      <Motion
        defaultStyle={{ fontSize: 2, y: 0 }}
        style={{ fontSize: spring(isActivated ? 3 : 2), y: spring(isActivated ? 100 : 0) }}>
        {interpolated =>
          <div
              className='command-palette'
              style={{
                transform: `translate(0, ${interpolated.y}px)`,
                fontSize: `${interpolated.fontSize}rem`
              }} >
            <input
              ref={(c) => this._input = c}
              type='text'
              className='command-palette__input'
              value={cmd}
              onFocus={this.activate}
              onBlur={this.deactivate}
              onKeyUp={this.onKeyUp}
              onChange={throttle((e) => this.executeCommand(e.target.value), 200)} />
            <div className='command-palette__complete'>
              <span>All tracks</span>
              <span className='command-palette__todo'>{' #breaks'}</span>
            </div>
          </div>
        }
      </Motion>
    );
  }

  onKeyUp(e) {
    if (e.keyCode === 27) {
      vbus.emit({
        tag: [':app/command-palette']
      });
    }

    console.log(e.keyCode)
  }

  executeCommand(cmd) {
    vbus.emit({
      tag: ':app/cmd',
      value: cmd
    });
  }

  activate() {
    vbus.emit({
      tag: [':app/command-palette', ':cmd/is-activated']
    });
  }

  deactivate() {
    vbus.emit({
      tag: [':app/command-palette']
    });
  }
}

export default updateOnKey(CommandPalette, [':db/command-palette', ':db/cmd']);
