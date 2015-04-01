var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var sm = require('app/soundmanager');
var player = require('app/db/player');

sm.on('finish', function (track) {
  vbus.emit(Atom.value(player).nextTrack().play());
});

sm.on('whileplaying', function (position) {
  if (!Atom.value(player).seeking) {
    vbus.emit(Atom.value(player).modify({ position: position }));
  }
});

sm.on('whileloading', function (bytesLoaded, bytesTotal) {
  vbus.emit(Atom.value(player).modify({ bytesLoaded, bytesTotal }));
});

sm.setup({
  url: 'swf',
  flashVersion: 9,
  preferFlash: false,
  debugMode: false
});

player
  .changes
  .map(p => p.track)
  .skipDuplicates()
  .onValue(track => sm.useTrack(track));

player
  .changes
  .map(p => p.isPlaying)
  .skipDuplicates()
  .onValue(function (isPlaying) {
    if (isPlaying) {
      sm.play();
    } else {
      sm.pause();
    }
  });

player
  .changes
  .map(p => [p.seeking, p.seekPosition])
  .skipDuplicates(([oldValue], [newValue]) => oldValue === newValue)
  .onValue(function([isSeeking, seekPosition]) {
    if (!isSeeking) {
      sm.setPosition(seekPosition);
    }
  });
