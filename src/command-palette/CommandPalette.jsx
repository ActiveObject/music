import React from 'react';
import { throttle } from 'underscore';
import db from 'app/db';
import vbus from 'app/vbus';
import { hasTag } from 'app/Tag';
import updateOnKey from 'app/fn/updateOnKey';
import './command-palette.css';

class CommandPalette extends React.Component {
  componentDidUpdate() {
    var isActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');

    if (isActivated && document.activeElement !== this._input) {
      this._input.select();
    }
  }

  render() {
    var cmd = db.value.get(':db/cmd');

    return (
      <div className='command-palette'>
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

export default updateOnKey(CommandPalette, ':db/cmd');
