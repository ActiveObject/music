var VkChunk = require('app/values/vk-chunk');

module.exports = function (receive, send) {
  receive('tracks:vk-index:update', function (db, index) {
    var tracks = db.get('tracks');

    if (VkChunk.is(index.chunkToLoad)) {
      index.load(db.get('vk'), db.get('user'), function (err, newIndex) {
        if (err) {
          return console.log(err);
        }

        send('tracks:vk-index:update', newIndex);
      });

      return send('tracks:update', tracks.modify({ vkIndex: index }));
    }

    send('tracks:update', tracks.modify({ vkIndex: index }));
  });

  receive('tracks:local-index:update', function (db, index) {
    var tracks = db.get('tracks');

    index.fetch(function (err, newIndex) {
      if (err) {
        return console.log(err);
      }

      send('tracks:update', tracks.modify({ localIndex: newIndex }));
    });

    send('tracks:update', tracks.modify({ localIndex: index }));
  });

  receive('tracks:update', function (db, tracks) {
    return db.set('tracks', tracks);
  });
};