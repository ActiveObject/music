var tracks = require('app/values/tracks');

module.exports = function (receive, send) {
  receive(':app/started', function(appstate) {
    return appstate.set('tracks', tracks);
  });

  receive(':app/tracks', function(appstate, v) {
    return appstate.set('tracks', v);
  });

  receive(':app/tracks', function(appstate, tracks) {
    send(tracks.updatePlayer(appstate.get('player')));
  });
};
