import React from 'react';
import key from 'keymaster';
import app from 'app';
import * as Player from 'app/Player';
import { toggleTag } from 'app/Tag';

class KeyboardDriver extends React.Component {
  componentWillMount() {
    this.unsub = bindKeys(function (key) {
      key('left', function () {
        app.push(Player.rewind(app.value.get(':db/player'), 5000));
      });

      key('right', function () {
        app.push(Player.forward(app.value.get(':db/player'), 5000));
      });

      key('space', function () {
        app.push(Player.togglePlay(app.value.get(':db/player')));
      });

      key('command+shift+p', function () {
        app.push(toggleTag(app.value.get(':db/command-palette'), ':cmd/is-activated'));
      });
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  render() {
    return <div/>
  }
}

function bindKeys(fn) {
  var keyCombinations = [];

  fn(function (...args) {
    keyCombinations.push(args[0]);
    key(...args);
  });

  return function () {
    keyCombinations.forEach(x => key.unbind(x));
  };
}

export default KeyboardDriver;
