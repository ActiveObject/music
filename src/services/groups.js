var vk = require('app/vk');
var merge = require('app/utils').merge;
var update = require('app/core/appstate').update;
var groups = require('app/values/groups');
var newsfeed = require('app/values/newsfeed');

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

        var newGroups = groups.fromVkResponse(chunk);

        send({ e: 'app', a: ':app/groups', v: appstate.get('groups').merge(newGroups) });
      });
    }
  });

  receive(':app/groups', function(appstate, v) {
    return appstate.set('groups', v);
  });

  receive(':app/started', function(appstate) {
    return appstate.set('groups', groups);
  });

  receive(':vk/wall', function(appstate, data) {
    send({ e: 'app', a: ':app/newsfeed', v: newsfeed.fromVkResponse(data) });
  });

  receive(':app/newsfeed', function(appstate, newsfeed) {
    send({ e: 'app', a: ':app/groups', v: appstate.get('groups').withNewsfeed(newsfeed) });
  });
};
