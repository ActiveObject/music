import key from 'keymaster';
import db from 'app/db';
import * as Player from 'app/Player';
import { toggleTag } from 'app/Tag';

export default function (vbus) {
  key('left', function () {
    vbus.emit(Player.rewind(db.value.get(':db/player'), 5000));
  });

  key('right', function () {
    vbus.emit(Player.forward(db.value.get(':db/player'), 5000));
  });

  key('space', function () {
    vbus.emit(Player.togglePlay(db.value.get(':db/player')));
  });

  key('command+shift+p', function () {
    vbus.emit(toggleTag(db.value.get(':db/command-palette'), ':cmd/is-activated'));
  });

  return function () {
    key.unbind('left');
    key.unbind('right');
    key.unbind('space');
    key.unbind('command+shift+p');
  };
}