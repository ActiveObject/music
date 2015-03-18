var vbus = require('app/core/vbus');
var sm = require('app/soundmanager');
var PlayerStore = require('app/stores/player-store');
var tagOf = require('app/utils/tagOf');

module.exports = function (receive, mount) {
  sm.on('finish', function (track) {
    vbus.push(PlayerStore.value.nextTrack().play());
  });

  sm.on('whileplaying', function (position) {
    if (!PlayerStore.value.seeking) {
      vbus.push(PlayerStore.value.modify({ position: position }));
    }
  });

  sm.on('whileloading', function (bytesLoaded, bytesTotal) {
    vbus.push(PlayerStore.value.modify({ bytesLoaded, bytesTotal }));
  });

  receive(':app/started', function (appstate) {
    sm.setup({
      url: 'swf',
      flashVersion: 9,
      preferFlash: false
    });
  });

  vbus
    .filter(v => tagOf(v) === ':app/player')
    .map(p => p.track)
    .skipDuplicates()
    .onValue(track => sm.useTrack(track))

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
    })

  vbus
    .filter(v => tagOf(v) === ':app/player')
    .map(p => [p.seeking, p.seekPosition])
    .skipDuplicates(([oldValue], [newValue]) => oldValue === newValue)
    .onValue(function([isSeeking, seekPosition]) {
      if (!isSeeking) {
        sm.setPosition(seekPosition)
      }
    })
};
