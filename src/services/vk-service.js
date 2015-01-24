var vk = require('app/vk');

module.exports = function VkService(receive, send, mount) {
  mount(vk);

  receive(':app/user', function(appstate, user) {
    vk.authorize(user);
  });
};
