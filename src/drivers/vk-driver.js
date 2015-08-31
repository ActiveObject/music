var hasTag = require('app/fn/hasTag');
var onValue = require('app/fn/onValue');
var vk = require('app/vk');

module.exports = function (vbus) {
  return onValue(vbus.filter(v => hasTag(v, ':user/authenticated')), user => vk.authorize(user));
};
