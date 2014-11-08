var VkChunk = require('app/values/vk-chunk');

module.exports = function (receive, send) {
  receive('groups:index:update', function (db, index) {
    var groups = db.get('groups');

    if (VkChunk.is(index.chunkToLoad)) {
      return db.get('vk').groups.get({
        user_id: db.get('user').id,
        offset: index.chunkToLoad.offset,
        count: index.chunkToLoad.count,
        extended: 1,
        v: '5.25'
      }, function (err, result) {
        if (err) {
          return console.log(err);
        }

        send('groups:index:update', index.fromVkResponse(result.response));
      });
    }

    send('groups:update', groups.setIndex(index));
  });

  receive('groups:update', function (db, groups) {
    return db.set('groups', groups);
  });
};