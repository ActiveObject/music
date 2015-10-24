import Atom from 'app/Atom';
import sm from 'app/soundmanager';
import player from 'app/db/player';
import onValue from 'app/fn/onValue';
import on from 'app/fn/on';
import { hasTag, removeTag } from 'app/Tag';
import merge from 'app/fn/merge';
import * as Player from 'app/Player';
import { omit } from 'underscore';

sm.setup({
  url: 'swf',
  flashVersion: 9,
  preferFlash: false,
  debugMode: false
});

export default function (vbus) {
  var unsub4 = on(sm, 'finish', function (track) {
    vbus.emit(Player.play(Player.nextTrack(Atom.value(player))));
  });

  var unsub5 = on(sm, 'whileplaying', function (position) {
    if (!Atom.value(player).seeking) {
      vbus.emit(merge(Atom.value(player), { position: position }));
    }
  });

  var unsub6 = on(sm, 'whileloading', function (bytesLoaded, bytesTotal) {
    vbus.emit(merge(Atom.value(player), { bytesLoaded, bytesTotal }));
  });

  var unsub1 = onValue(player.changes.map(p => p.track).skipDuplicates(), function (track) {
    sm.useTrack(track);
  });

  var unsub2 = onValue(player.changes.map(p => hasTag(p, ':player/is-playing')).skipDuplicates(), function (isPlaying) {
    if (isPlaying) {
      sm.play();
    } else {
      sm.pause();
    }
  });

  var unsub3 = onValue(player
      .changes.map(p => [hasTag(p, ':player/seeking'), p.seekPosition])
      .skipDuplicates(([oldValue], [newValue]) => oldValue === newValue), function([isSeeking, seekPosition]) {
    if (!isSeeking) {
      sm.setPosition(seekPosition);
    }
  });

  var unsub7 = onValue(player.changes, function (p) {
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
