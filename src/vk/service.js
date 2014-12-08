var vk = require('./vk-api');

module.exports = function VkService(receive, send) {
  vk.on('change', function(value) {
    send({ e: 'app', a: ':app/vk', v: value });
  });

  receive(':app/vk', function(appstate, v) {
    return appstate.set('vk', v);
  });

  receive(':app/user', function(appstate, user) {
    if (user.isAuthenticated() && !appstate.get('vk').isAuthorized) {
      vk.authorize(user.id, user.accessToken);
    }
  });
};
