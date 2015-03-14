var vbus = require('app/core/vbus');
var sm = require('app/soundmanager');

module.exports = function (receive, mount) {
  sm.on('finish', function (track) {
    vbus.push([':soundmanager/finish', track]);
  });

  sm.on('whileplaying', function (position) {
    vbus.push([':soundmanager/position', position]);
  });

  sm.on('whileloading', function (bytesLoaded, bytesTotal) {
    vbus.push([':soundmanager/bytes-loaded', bytesLoaded]);
    vbus.push([':soundmanager/bytes-total', bytesTotal]);
  });

  receive(':app/started', function (appstate) {
    sm.setup({
      url: 'swf',
      flashVersion: 9,
      preferFlash: false
    });
  });

  receive(':app/player', function (appstate, player) {
    if (appstate.get('player').track !== player.track) {
      sm.useTrack(player.track);

      if (player.isPlaying) {
        sm.play();
      }

      return;
    }

    if (!appstate.get('player').isPlaying && player.isPlaying) {
      return sm.play();
    }

    if (appstate.get('player').isPlaying && !player.isPlaying) {
      return sm.pause();
    }

    if (appstate.get('player').position !== player.position) {
      sm.setPosition(player.position);
    }
  });
};
