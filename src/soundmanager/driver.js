import Kefir from 'kefir'
import app from 'app';
import sm from 'app/soundmanager';
import onValue from 'app/onValue';
import { hasTag, removeTag } from 'app/Tag';
import merge from 'app/merge';
import * as Player from 'app/Player';
import { omit } from 'underscore';
import subscribeWith from 'app/subscribeWith';

function on(emitter, event, fn) {
  emitter.on(event, fn);

  return function() {
    emitter.removeListener(event, fn);
  };
}

sm.setup({
  url: 'swf',
  flashVersion: 9,
  preferFlash: false,
  debugMode: false
});

export default function () {
  var playerChanges = Kefir.fromEvents(app, 'change').map(dbVal => dbVal.get(':db/player'));

  return subscribeWith(on, onValue, function (on, onValue) {
    on(sm, 'finish', function (track) {
      app.push(Player.play(Player.nextTrack(app.value.get(':db/player'))));
    });

    on(sm, 'whileplaying', function (position) {
      if (!app.value.get(':db/player').seeking) {
        app.push(merge(app.value.get(':db/player'), { position: position }));
      }
    });

    on(sm, 'whileloading', function (bytesLoaded, bytesTotal) {
      app.push(merge(app.value.get(':db/player'), { bytesLoaded, bytesTotal }));
    });

    onValue(playerChanges, player => {
      if (hasTag(player, ':player/seek-to-position')) {
        app.push(merge(omit(removeTag(player, ':player/seek-to-position'), 'seekToPosition'), { position: player.seekToPosition }));
      }

      sm.tick(player);
    });
  });
}
