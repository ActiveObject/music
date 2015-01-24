var _ = require('underscore');
var ISet = require('immutable').Set;
var moment = require('moment');
var newsfeed = require('app/values/newsfeed');
var activity = require('app/values/activity');
var group = require('app/values/group');
var Track = require('app/values/track');
var merge = require('app/utils/merge');
var vk = require('app/vk');

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

module.exports = function VkService(receive, send, mount) {
  mount(vk);

  receive(':app/user', function(appstate, user) {
    vk.authorize(user);
  });

  receive(':app/user', function(appstate, user) {
    if (user.isAuthenticated()) {
      send({ e: 'vk', a: ':vk/audio-request', v: { user: user, offset: 0, count: 1000 } });
    }
  });

  receive(':vk/tracks', function (appstate, res) {
    var tracks = res.items.map(function(vkData, i) {
      return new Track(merge(vkData, { index: res.offset + i }));
    });

    send({ e: 'app', a: ':app/tracks', v: ISet(tracks) });
  });

  receive(':vk/audio-request', function (appstate, request) {
    loadTracks(request.user, request.offset, request.count, function(err, chunk) {
      if (err) {
        return send({ e: 'vk', a: ':vk/error', v: chunk });
      }

      send({ e: 'vk', a: ':vk/tracks', v: chunk });
    });
  });
};
