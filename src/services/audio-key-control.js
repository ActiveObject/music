var key = require('keymaster');
var playerAtom = require('app/db/player');
var Player = require('app/values/player');

module.exports = function (vbus) {

  key('left', function () {
    vbus.emit(Player.rewind(playerAtom.value, 5000));
  });

  key('right', function () {
    vbus.emit(Player.forward(playerAtom.value, 5000));
  });

  key('space', function () {
    vbus.emit(Player.togglePlay(playerAtom.value));
  });

  return function () {
    key.unbind('left');
    key.unbind('right');
    key.unbind('space');
  };
};