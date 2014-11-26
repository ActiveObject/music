var VkIndex = require('app/values/vk-index');
var db = require('app/core/db');
var Database = require('app/core/database');
var vk = require('app/vk');

var vkIndex = new VkIndex({
  chunkSize: 1000,
  transformFn: function (item, i) {
    var id = 'tracks/' + item.id;

    return [
      [id, ':track/artist', item.artist],
      [id, ':track/title', item.title],
      [id, ':track/duration', item.duration],
      [id, ':track/url', item.url],
      [id, ':track/lyrics_id', item.lyrics_id],
      [id, ':track/owner_id', item.owner_id],
      [id, ':track/vkid', item.id],
      [id, ':track/vk-index', i]
    ];
  },

  loadFn: function (user, chunkToLoad, callback) {
    vk.audio.get({
      owner_id: user.id,
      offset: chunkToLoad.offset,
      count: chunkToLoad.count
    }, callback);
  }
});

vkIndex.on('load', function (index) {
  db.swap(db.value.update('tracks', function (tracks) {
    return tracks.modify({ db: new Database(index.items) });
  }));
});

module.exports = function (receive, send) {
  return function tracksService(appstate) {
    if (appstate.get('user').isAuthenticated() && !vkIndex.value.isBuilt && !vkIndex.value.isBuilding) {
      vkIndex.build(appstate.get('user'));
    }

    return appstate;
  };
};
