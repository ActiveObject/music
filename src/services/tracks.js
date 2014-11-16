var VkIndex = require('app/values/vk-index');
var db = require('app/core/db');

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

  loadFn: function (vk, user, chunkToLoad, callback) {
    vk.audio.get({
      owner_id: user.id,
      offset: chunkToLoad.offset,
      count: chunkToLoad.count,
      v: '5.25'
    }, callback);
  }
});

vkIndex.on('load', function (index) {
  db.swap(db.value.update('tracks', function (tracks) {
    return tracks.modify({ vkIndex: index });
  }));
});

module.exports = function (receive, send) {
  receive('vk:ready', function () {
    vkIndex.build(db.value.get('vk'), db.value.get('user'));
  });
};