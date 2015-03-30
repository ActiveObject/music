var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var sm = require('app/soundmanager');
var db = require('app/core/db');
var tagOf = require('app/utils/tagOf');

var player = require('app/player');

sm.on('finish', function (track) {
  vbus.push(Atom.value(player).nextTrack().play());
});

sm.on('whileplaying', function (position) {
  if (!Atom.value(player).seeking) {
    vbus.push(Atom.value(player).modify({ position: position }));
  }
});

sm.on('whileloading', function (bytesLoaded, bytesTotal) {
  vbus.push(Atom.value(player).modify({ bytesLoaded, bytesTotal }));
});

sm.setup({
  url: 'swf',
  flashVersion: 9,
  preferFlash: false,
  debugMode: false
});

vbus
  .filter(v => tagOf(v) === ':app/player')
  .map(p => p.track)
  .skipDuplicates()
  .onValue(track => sm.useTrack(track));

vbus
  .filter(v => tagOf(v) === ':app/player')
  .map(p => p.isPlaying)
  .skipDuplicates()
  .onValue(function (isPlaying) {
    if (isPlaying) {
      sm.play();
    } else {
      sm.pause();
    }
  });

vbus
  .filter(v => tagOf(v) === ':app/player')
  .map(p => [p.seeking, p.seekPosition])
  .skipDuplicates(([oldValue], [newValue]) => oldValue === newValue)
  .onValue(function([isSeeking, seekPosition]) {
    if (!isSeeking) {
      sm.setPosition(seekPosition);
    }
  });
