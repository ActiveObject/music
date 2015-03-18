var vbus = require('app/core/vbus');
var tagOf = require('app/utils/tagOf');
var vk = require('app/vk');

vbus
  .filter(v => tagOf(v) === ':app/authenticated-user')
  .onValue(user => vk.authorize(user));
