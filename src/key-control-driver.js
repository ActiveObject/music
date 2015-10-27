import key from 'keymaster';
import app from 'app';
import * as Player from 'app/Player';
import { toggleTag } from 'app/Tag';

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

export default function (vbus) {
  return bindKeys(function (key) {
    key('left', function () {
      vbus.push(Player.rewind(app.value.get(':db/player'), 5000));
    });

    key('right', function () {
      vbus.push(Player.forward(app.value.get(':db/player'), 5000));
    });

    key('space', function () {
      vbus.push(Player.togglePlay(app.value.get(':db/player')));
    });

    key('command+shift+p', function () {
      vbus.push(toggleTag(app.value.get(':db/command-palette'), ':cmd/is-activated'));
    });
  });
}