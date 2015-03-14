var vbus = require('vbus');
var Firebase = require('firebase');

module.exports = function (dbUrl) {
  var dbRef = new Firebase(dbUrl);
  var trackRef = dbRef.child('player/track');

  return function (receive) {
    receive(':app/started', function () {
      trackRef.on('value', function (snapshot) {
        vbus.push({ e: 'app/player', a: ':player/track', v: snapshot.val() });
      });
    });

    receive(':player/track', function (appstate, track) {
      trackRef.set(track);
    });
  };
};