import React from 'react';
import key from 'keymaster';
import app from 'app';
import * as Player from 'app/shared/Player';
import { toggleTag } from 'app/shared/Tag';

class KeyboardDriver extends React.Component {
  componentWillMount() {
    this.unsub = bindKeys(function (key) {
      key('left', function () {
        console.log(`[KeyboardDriver] rewind 5s`);
        app.push(Player.rewind(app.value.get(':db/player'), 5000));
      });

      key('right', function () {
        console.log(`[KeyboardDriver] forward 5s`);
        app.push(Player.forward(app.value.get(':db/player'), 5000));
      });

      key('space', function () {
        console.log(`[KeyboardDriver] toggle play`);
        app.push(Player.togglePlay(app.value.get(':db/player')));
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
