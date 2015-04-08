var tagOf = require('app/utils/tagOf');
var onValue = require('app/utils/onValue');
var vk = require('app/vk');

module.exports = function (vbus) {
  return onValue(vbus.filter(v => tagOf(v) === ':app/authenticated-user'), user => vk.authorize(user));
};
