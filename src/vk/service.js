var _ = require('underscore');
var groups = require('app/values/groups');
var merge = require('app/utils').merge;
var vk = require('./vk-api');


function loadGroups(user, offset, count, callback) {
  vk.groups.get({
    user_id: user.id,
    offset: offset,
    count: count,
    extended: 1
  }, function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, merge(res.response, {
      offset: offset
    }));

    if (res.response.count > 0 && res.response.count > offset + count) {
      return loadGroups(user, offset + count, count, callback);
    }
  });
}

module.exports = function VkService(receive, send, watch, mount) {
  mount(vk);

  receive(':app/user', function(appstate, user) {
    vk.authorize(user);
  });

  receive(':app/user', function(appstate, user) {
    if (user.isAuthenticated()) {
      loadGroups(user, 0, 1000, function(err, chunk) {
        if (err) {
          return console.log(err);
        }

        var newGroups = groups.fromVkResponse(chunk);

        send({ e: 'app', a: ':app/groups', v: appstate.get('groups').merge(newGroups) });
      });
    }
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
