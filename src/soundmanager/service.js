var db = require('app/core/db');
var eventBus = require('app/core/event-bus');
var sm = require('app/soundmanager');

sm.on('change', function (newState) {
  eventBus.push({ e: 'app/soundmanager', a: ':soundmanager/value', v: newState });
});

sm.on('finish', function (track) {
  eventBus.push({ e: 'app/soundmanager', a: ':soundmanager/finish', v: track });
});

sm.on('whileplaying', function (position) {
  eventBus.push({ e: 'app/soundmanager', a: ':soundmanager/position', v: position });
});

sm.on('whileloading', function (bytesLoaded, bytesTotal) {
  eventBus.push({ e: 'app/soundmanager', a: ':soundmanager/bytes-loaded', v: bytesLoaded });
  eventBus.push({ e: 'app/soundmanager', a: ':soundmanager/bytes-total', v: bytesTotal });
});

module.exports = function (receive) {
  receive(':app/started', function (appstate) {
    sm.setup({
      url: 'swf',
      flashVersion: 9,
      preferFlash: false
    });
  });

  receive(':soundmanager/value', function (appstate, v) {
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