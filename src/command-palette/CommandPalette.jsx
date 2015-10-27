import React from 'react';
import { throttle } from 'underscore';
import cx from 'classnames';
import db from 'app/db';
import vbus from 'app/vbus';
import { hasTag } from 'app/Tag';
import updateOn from 'app/updateOn';
import './command-palette.css';
import { toggleShuffle } from 'app/Player';

class CommandPalette extends React.Component {
  componentDidUpdate() {
    var isActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');

    if (isActivated && document.activeElement !== this._input) {
      this._input.select();
    }
  }

  render() {
    var cmd = db.value.get(':db/cmd');
    var player = db.value.get(':db/player');
    var isShuffled = hasTag(player, ':player/is-shuffled');

    return (
      <div className='command-palette'>
        <div style={{ position: 'relative' }}>
          <input
            ref={(c) => this._input = c}
            type='text'
            className='command-palette__input'
            value={cmd}
            onFocus={this.activate}
            onBlur={this.deactivate}
            onKeyUp={this.onKeyUp}
            onChange={throttle((e) => this.executeCommand(e.target.value), 200)} />
          <div className='command-palette__actions'>
            <span className={cx({ 'command-palette__action': true, 'command-palette__action--active': isShuffled })} onClick={shuffle}>shuffle</span>
          </div>
        </div>
        <div className='command-palette__complete'>
          <span>All tracks</span>
          <span className='command-palette__todo'>{' #breaks'}</span>
        </div>
      </div>
    );
  }

  onKeyUp(e) {
    if (e.keyCode === 27) {
      vbus.push({
        tag: [':app/command-palette']
      });
    }

    console.log(e.keyCode)
  }

  executeCommand(cmd) {
    vbus.push({
      tag: ':app/cmd',
      value: cmd
    });
  }

  activate() {
    vbus.push({
      tag: [':app/command-palette', ':cmd/is-activated']
    });
  }

  deactivate() {
    vbus.push({
      tag: [':app/command-palette']
    });
  }
}


function shuffle() {
  vbus.push(toggleShuffle(db.value.get(':db/player')));
}

export default updateOn(CommandPalette, ':db/cmd', dbVal => dbVal.get(':db/player').tracklist);
