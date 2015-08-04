var key = require('keymaster');
var playerAtom = require('app/db/player');

module.exports = function (vbus) {

  key('left', function () {
    vbus.emit(playerAtom.value.rewind(5000));
  });

  key('right', function () {
    vbus.emit(playerAtom.value.forward(5000));
  });

  return function () {
    key.unbind('left');
    key.unbind('right');
  };
};