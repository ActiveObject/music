var tagOf = require('app/fn/tagOf');
var onValue = require('app/fn/onValue');
var vk = require('app/vk');

module.exports = function (vbus) {
  return onValue(vbus.filter(v => tagOf(v) === ':app/authenticated-user'), user => vk.authorize(user));
};
