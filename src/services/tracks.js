module.exports = function (receive, send) {
  receive('tracks:update', function (db, tracks) {
    if (tracks.isLoading()) {
      return db.get('vk').audio.get({
        owner_id: db.get('user').id,
        offset: tracks.items.options.offset,
        count: 1000,
        v: '5.25'
      }, function (err, result) {
        if (err) {
          return console.log(err);
        }

        send('tracks:update', tracks.fromVkResponse(result.response));
      });
    }

    return db.set('tracks', tracks);
  });
};