var Atom = require('app/core/atom');
var sm = require('app/soundmanager');
var player = require('app/db/player');
var onValue = require('app/fn/onValue');
var on = require('app/fn/on');

sm.setup({
  url: 'swf',
  flashVersion: 9,
  preferFlash: false,
  debugMode: false
});

module.exports = function (vbus) {
  var unsub4 = on(sm, 'finish', function (track) {
    vbus.emit(Atom.value(player).nextTrack().play());
  });

  var unsub5 = on(sm, 'whileplaying', function (position) {
    if (!Atom.value(player).seeking) {
      vbus.emit(Atom.value(player).modify({ position: position }));
    }
  });

  var unsub6 = on(sm, 'whileloading', function (bytesLoaded, bytesTotal) {
    vbus.emit(Atom.value(player).modify({ bytesLoaded, bytesTotal }));
  });

  var unsub1 = onValue(player.changes.map(p => p.track).skipDuplicates(), function (track) {
    sm.useTrack(track);
  });

  var unsub2 = onValue(player.changes.map(p => p.isPlaying).skipDuplicates(), function (isPlaying) {
    if (isPlaying) {
      sm.play();
    } else {
      sm.pause();
    }
  });

  var unsub3 = onValue(player
      .changes.map(p => [p.seeking, p.seekPosition])
      .skipDuplicates(([oldValue], [newValue]) => oldValue === newValue), function([isSeeking, seekPosition]) {
    if (!isSeeking) {
      sm.setPosition(seekPosition);
    }
  });

  return function() {
    unsub1();
    unsub2();
    unsub3();
    unsub4();
    unsub5();
    unsub6();
  };
};

