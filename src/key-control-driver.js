var key = require('keymaster');
var db = require('app/db');
var playerAtom = require('app/db/player');
var Player = require('app/Player');
var { toggleTag } = require('app/Tag');

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

  key('command+shift+p', function () {
    vbus.emit(toggleTag(db.value.get(':db/command-palette'), ':cmd/is-activated'));
  });

  return function () {
    key.unbind('left');
    key.unbind('right');
    key.unbind('space');
    key.unbind('command+shift+l');
  };
};