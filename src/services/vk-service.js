var vk = require('app/vk');

module.exports = function VkService(receive, mount) {
  receive(':app/user', function(appstate, user) {
    vk.authorize(user);
  });
};
