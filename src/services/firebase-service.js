var Firebase = require('firebase');

module.exports = function (dbUrl) {
  var dbRef = new Firebase(dbUrl);
  var trackRef = dbRef.child('player/track');

  return function (receive, send) {
    receive(':app/started', function () {
      trackRef.on('value', function (snapshot) {
        send({ e: 'app/player', a: ':player/track', v: snapshot.val() });
      });
    });

    receive(':player/track', function (appstate, track) {
      trackRef.set(track);
    });
  };
};