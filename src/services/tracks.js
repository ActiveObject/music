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
    return appstate.set('tracks', tracks);
  });

  receive(':app/user', function(appstate, user) {
    if (user.isAuthenticated()) {
      loadTracks(user, 0, 1000, function(err, chunk) {
        if (err) {
          return console.log(err);
        }

        send({ e: 'vk', a: ':vk/tracks', v: chunk });
      });
    }
  });

  receive(':vk/tracks', function(appstate, res) {
    send({
      e: 'app',
      a: ':app/tracks',
      v: appstate.get('tracks').merge(tracks.fromVkResponse(res))
    });
  });

  receive(':app/tracks', function(appstate, v) {
    return appstate.set('tracks', v);
  });

  receive(':app/tracks', function(appstate, tracks) {
    send(tracks.updatePlayer(appstate.get('player')));
  });
};
