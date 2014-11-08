var VkChunk = require('app/values/vk-chunk');

module.exports = function (receive, send) {
  receive('tracks:index:update', function (db, index) {
    var tracks = db.get('tracks');

    if (VkChunk.is(index.chunkToLoad)) {
      db.get('vk').audio.get({
        owner_id: db.get('user').id,
        offset: index.chunkToLoad.offset,
        count: index.chunkToLoad.count,
        v: '5.25'
      }, function (err, result) {
        if (err) {
          return console.log(err);
        }

        send('tracks:index:update', index.fromVkResponse(result.response));
      });

      return send('tracks:update', tracks.setIndex(index));
    }

    send('tracks:update', tracks.setIndex(index));
  });

  receive('tracks:update', function (db, tracks) {
    return db.set('tracks', tracks);
  });
};