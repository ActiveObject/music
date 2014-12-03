var db = require('app/core/db');
var vk = require('app/vk');
var tracks = require('app/values/tracks');
var merge = require('app/utils').merge;

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

module.exports = function (receive, send) {
  receive(':app/started', function(appstate) {
    if (appstate.get('user').isAuthenticated()) {
      loadTracks(appstate.get('user'), 0, 1000, function(err, chunk) {
        if (err) {
          return console.log(err);
        }

        send({ e: 'app', a: ':app/tracks', v: tracks.fromVkResponse(chunk) });
      });
    }
  });

  receive(':app/tracks', function(appstate, v) {
    return appstate.update('tracks', function(tracks) {
      return tracks.merge(v);
    });
  });
};
