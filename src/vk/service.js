var _ = require('underscore');
var vk = require('./vk-api');

module.exports = function VkService(receive, send, watch, mount) {
  mount(vk);

  receive(':app/user', function(appstate, user) {
    vk.authorize(user);
  });

  receive(':vk/wall-request', function(appstate, request) {
    if (request.count > 100) {
      send({
        e: 'vk',
        a: ':vk/wall-request',
        v: {
          owner: request.owner,
          offset: request.offset + 100,
          count: request.count - 100
        }
      });
    }

    vk.wall.get({
      owner_id: request.owner,
      offset: request.offset,
      count: request.count < 100 ? request.count : 100
    }, function(err, res) {
      if (err) {
        return send({ e: 'vk', a: ':vk/error', v: err });
      }

      send({ e: 'vk', a: ':vk/wall', v: _.extend(res.response, { owner: request.owner }) });
    });
  });
};
