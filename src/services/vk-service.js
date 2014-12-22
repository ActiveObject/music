var _ = require('underscore');
var ISet = require('immutable').Set;
var newsfeed = require('app/values/newsfeed');
var activity = require('app/values/activity');
var group = require('app/values/group');
var Track = require('app/values/track');
var merge = require('app/utils').merge;
var vk = require('app/vk');

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

function loadTracks(user, offset, count, callback) {
  vk.audio.get({
    owner_id: user.id,
    offset: offset,
    count: count
  }, function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, merge(res.response, {
      offset: offset
    }));

    if (res.response.count > 0 && res.response.count > offset + count) {
      return loadTracks(user, offset + count, count, callback);
    }
  });
}

function loadWall(owner, offset, count, callback) {
  vk.wall.get({
    owner_id: owner,
    offset: offset,
    count: count < 100 ? count : 100
  }, function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, merge(res.response, {
      offset: offset
    }));

    if (count - 100 > 0) {
      return loadWall(owner, offset + 100, count - 100, callback);
    }
  });
}

module.exports = function VkService(receive, send, mount) {
  mount(vk);

  receive(':app/user', function(appstate, user) {
    vk.authorize(user);
  });

  receive(':app/user', function(appstate, user) {
    if (user.isAuthenticated()) {
      send({ e: 'vk', a: ':vk/groups-request', v: { user: user, offset: 0, count: 100 } });
    }
  });

  receive(':app/user', function(appstate, user) {
    if (user.isAuthenticated()) {
      send({ e: 'vk', a: ':vk/audio-request', v: { user: user, offset: 0, count: 1000 } });
    }
  });

  receive(':vk/groups', function (appstate, res) {
    var groups = res.items.map(function(vkData) {
      return group.modify(vkData);
    });

    send({ e: 'app', a: ':app/groups', v: ISet(groups) });
  });

  receive(':vk/tracks', function (appstate, res) {
    var tracks = res.items.map(function(vkData, i) {
      return new Track(merge(vkData, { index: res.offset + i }));
    });

    send({ e: 'app', a: ':app/tracks', v: ISet(tracks) });
  });

  receive(':vk/wall', function(appstate, data) {
    send({ e: 'app', a: ':app/newsfeed', v: newsfeed.fromVkResponse(data) });
  });

  receive(':vk/activity', function(appstate, data) {
    var nf = newsfeed.fromVkResponse(data);
    var v = activity.fromNewsfeed(nf).modify({ owner: data.owner });
    send({ e: 'app', a: ':app/activity', v: v });
  });

  receive(':vk/groups-request', function (appstate, request) {
    loadGroups(request.user, request.offset, request.count, function(err, chunk) {
      if (err) {
        return send({ e: 'vk', a: ':vk/error', v: chunk });
      }

      send({ e: 'vk', a: ':vk/groups', v: chunk });
    });
  });

  receive(':vk/audio-request', function (appstate, request) {
    loadTracks(request.user, request.offset, request.count, function(err, chunk) {
      if (err) {
        return send({ e: 'vk', a: ':vk/error', v: chunk });
      }

      send({ e: 'vk', a: ':vk/tracks', v: chunk });
    });
  });

  receive(':vk/wall-request', function(appstate, request) {
    loadWall(request.owner, request.offset, request.count, function (err, chunk) {
      if (err) {
        return send({ e: 'vk', a: ':vk/error', v: err });
      }

      send({ e: 'vk', a: ':vk/wall', v: _.extend(chunk, { owner: request.owner }) });
    });
  });

  receive(':vk/activity-request', function(appstate, request) {
    loadWall(request.owner, request.offset, request.count, function (err, chunk) {
      if (err) {
        return send({ e: 'vk', a: ':vk/error', v: err });
      }

      send({ e: 'vk', a: ':vk/activity', v: _.extend(chunk, { owner: request.owner }) });
    });
  });
};
