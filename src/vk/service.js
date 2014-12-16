var _ = require('underscore');
var vk = require('./vk-api');

module.exports = function VkService(receive, send) {
  vk.atom.on('change', function(value) {
    send({ e: 'app', a: ':app/vk', v: value });
  });

  receive(':app/vk', function(appstate, v) {
    return appstate.set('vk', v);
  });

  receive(':app/started', function(appstate) {
    return appstate.set('vk', vk.state);
  });

  receive(':app/user', function(appstate, user) {
    vk.authorize(user);
  });

  receive(':vk/wall-request', function(appstate, request) {
    vk.wall.get({
      owner_id: request.owner,
      offset: request.offset,
      count: request.count
    }, function(err, res) {
      if (err) {
        return send({ e: 'vk', a: ':vk/error', v: err });
      }

      send({ e: 'vk', a: ':vk/wall', v: _.extend(res.response, { owner: request.owner }) });
    });
  });
};
