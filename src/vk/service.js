var db = require('app/core/db');
var vk = require('./vk-api');

vk.on('change', function(value) {
  db.swap(db.value.set('vk', vk.state));
});

module.exports = function VkService() {
  return function (appstate) {
    if (!appstate.get('vk').isAuthorized && appstate.get('user').isAuthenticated()) {
      vk.authorize(appstate.get('user').id, appstate.get('user').accessToken);
    }

    return appstate;
  };
};
