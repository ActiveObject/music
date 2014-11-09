var VkChunk = require('app/values/vk-chunk');

module.exports = function (receive, send) {
  receive('tracks:vk-index:update', function (db, index) {
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

        send('tracks:vk-index:update', index.fromVkResponse(result.response));
      });

      return send('tracks:update', tracks.modify({ vkIndex: index }));
    }

    send('tracks:update', tracks.modify({ vkIndex: index }));
  });

  receive('tracks:local-index:update', function (db, index) {
    var tracks = db.get('tracks');

    index.db.allDocs({ include_docs: true }, function (err, response) {
      if (err) {
        return console.log(err);
      }

      send('tracks:update', tracks.modify({ localIndex: index.fromResponse(response) }));
    });

    send('tracks:update', tracks.modify({ localIndex: index }));
  });

  receive('tracks:update', function (db, tracks) {
    return db.set('tracks', tracks);
  });
};