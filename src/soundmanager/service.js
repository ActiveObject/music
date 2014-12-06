var sm = require('app/soundmanager');

module.exports = function (receive, send) {
  sm.on('change', function (newState) {
    send({ e: 'app', a: ':app/soundmanager', v: newState });
  });

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

  receive(':app/soundmanager', function (appstate, v) {
    return appstate.set('soundmanager', v);
  });

  receive(':player/is-playing', function (appstate, isPlaying) {
    if (isPlaying) {
      sm.play();
    } else {
      sm.pause();
    }
  });

  receive(':player/track', function (appstate, track) {
    sm.useTrack(track);
  });

  receive(':player/position', function (appstate, v) {
    sm.setPosition(v);
  });
};
