var vk = require('app/vk');
var merge = require('app/utils').merge;
var groups = require('app/values/groups');

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

module.exports = function (receive, send) {
  receive(':app/user', function(appstate, user) {
    if (user.isAuthenticated()) {
      loadGroups(user, 0, 1000, function(err, chunk) {
        if (err) {
          return console.log(err);
        }

        send({ e: 'app', a: ':app/groups', v: groups.fromVkResponse(chunk) });
      });
    }
  });

  receive(':app/groups', function(appstate, v) {
    return appstate.update('groups', function(groups) {
      return groups.merge(v);
    });
  });
};
