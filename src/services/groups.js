module.exports = function (receive, send) {
  receive('groups:update', function (db, groups) {
    if (groups.isLoading()) {
      return db.get('vk').groups.get({
        user_id: db.get('user').id,
        offset: groups.items.options.offset,
        count: 100,
        extended: 1,
        v: '5.25'
      }, function (err, result) {
        if (err) {
          return console.log(err);
        }

        send('groups:update', groups.fromVkResponse(result.response));
      });
    }

    return db.set('groups', groups);
  });
};