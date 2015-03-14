var sm = require('app/soundmanager');

module.exports = function (receive, send, mount) {
  sm.on('finish', function (track) {
    send({ e: 'app/soundmanager', a: ':soundmanager/finish', v: track });
  });

  sm.on('whileplaying', function (position) {
    send({ e: 'app/soundmanager', a: ':soundmanager/position', v: position });
  });

  sm.on('whileloading', function (bytesLoaded, bytesTotal) {
    send({ e: 'app/soundmanager', a: ':soundmanager/bytes-loaded', v: bytesLoaded });
    send({ e: 'app/soundmanager', a: ':soundmanager/bytes-total', v: bytesTotal });
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
