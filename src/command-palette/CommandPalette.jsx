import React from 'react';
import throttle from 'lodash/throttle';
import cx from 'classnames';
import app from 'app';
import { hasTag, toggleTag } from 'app/Tag';
import { updateOn } from 'app/renderer';
import './command-palette.css';

class CommandPalette extends React.Component {
  componentDidUpdate() {
    var isActivated = hasTag(app.value.get(':db/command-palette'), ':cmd/is-activated');

    if (isActivated && document.activeElement !== this._input) {
      this._input.select();
    }
  }

  render() {
    var cmd = app.value.get(':db/cmd');
    var player = app.value.get(':db/player');
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
      app.push({
        tag: [':app/command-palette']
      });
    }
  }

  executeCommand(cmd) {
    app.push({
      tag: ':app/cmd',
      value: cmd
    });
  }

  activate() {
    app.push({
      tag: [':app/command-palette', ':cmd/is-activated']
    });
  }

  deactivate() {
    app.push({
      tag: [':app/command-palette']
    });
  }
}

function shuffle() {
  app.push({
    tag: ':library/toggle-shuffle'
  });
}

export default updateOn(CommandPalette, ':db/cmd', db => hasTag(db.get(':db/player'), ':player/is-shuffled'));
