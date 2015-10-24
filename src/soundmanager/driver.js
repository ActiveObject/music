import db from 'app/db';
import sm from 'app/soundmanager';
import onValue from 'app/onValue';
import { hasTag, removeTag } from 'app/Tag';
import merge from 'app/merge';
import * as Player from 'app/Player';
import { omit } from 'underscore';

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

export default function (vbus) {
  var playerChanges = db.changes.map(dbVal => dbVal.get(':db/player'));

  var unsub4 = on(sm, 'finish', function (track) {
    vbus.emit(Player.play(Player.nextTrack(db.value.get(':db/player'))));
  });

  var unsub5 = on(sm, 'whileplaying', function (position) {
    if (!db.value.get(':db/player').seeking) {
      vbus.emit(merge(db.value.get(':db/player'), { position: position }));
    }
  });

  var unsub6 = on(sm, 'whileloading', function (bytesLoaded, bytesTotal) {
    vbus.emit(merge(db.value.get(':db/player'), { bytesLoaded, bytesTotal }));
  });

  var unsub1 = onValue(playerChanges.map(p => p.track).skipDuplicates(), function (track) {
    sm.useTrack(track);
  });

  var unsub2 = onValue(playerChanges.map(p => hasTag(p, ':player/is-playing')).skipDuplicates(), function (isPlaying) {
    if (isPlaying) {
      sm.play();
    } else {
      sm.pause();
    }
  });

  var unsub3 = onValue(playerChanges.map(p => [hasTag(p, ':player/seeking'), p.seekPosition])
      .skipDuplicates(([oldValue], [newValue]) => oldValue === newValue), function([isSeeking, seekPosition]) {
    if (!isSeeking) {
      sm.setPosition(seekPosition);
    }
  });

  var unsub7 = onValue(playerChanges, function (p) {
    if (hasTag(p, ':player/seek-to-position')) {
      vbus.emit(merge(omit(removeTag(p, ':player/seek-to-position'), 'seekToPosition'), { position: p.seekToPosition }));
      sm.setPosition(p.seekToPosition);
    }
  });

  return function() {
    unsub1();
    unsub2();
    unsub3();
    unsub4();
    unsub5();
    unsub6();
    unsub7();
  };
}
