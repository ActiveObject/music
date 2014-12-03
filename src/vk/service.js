var vk = require('./vk-api');

module.exports = function VkService(receive, send) {
  vk.on('change', function() {
    send({ e: 'app', a: ':app/vk', v: vk.state });
  });

  receive(':app/vk', function(appstate, v) {
    return appstate.set('vk', v);
  });

  return function (appstate) {
    if (!appstate.get('vk').isAuthorized && appstate.get('user').isAuthenticated()) {
      vk.authorize(appstate.get('user').id, appstate.get('user').accessToken);
    }

    return appstate;
  };
};
