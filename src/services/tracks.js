var List = require('immutable').List;
var RemoteResource = require('app/values/remote-resource');
var Track = require('app/values/track');

function loadInitial(vk, user, callback) {
  vk.audio.get({
    owner_id: user.id,
    offset: 0,
    count: 1000,
    v: '5.25'
  }, function (err, result) {
    if (err) {
      return callback(err);
    }

    var data = {
      count: result.response.count,
      items: List(result.response.items.map(Track))
    };

    callback(null, new RemoteResource('inprogress', data, { offset: 1000 }));
  });
}

function loadRemote(resource, vk, user, callback) {
  if (resource.options.offset >= resource.data.count) {
    return callback(null, new RemoteResource('done', resource.data));
  }

  vk.audio.get({
    owner_id: user.id,
    offset: resource.options.offset,
    count: 1000,
    v: '5.25'
  }, function (err, result) {
    if (err) {
      return callback(err);
    }

    var data = {
      count: result.response.count,
      items: resource.data.items.concat(result.response.items.map(Track))
    };

    callback(null, new RemoteResource('inprogress', data, { offset: resource.options.offset + 1000 }));
  });
}

module.exports = function (dbStream, receive, send, watch) {
  receive('tracks:update', function (db, tracks) {
    return db.set('tracks', tracks);
  });

  receive('tracks:load:all', function (db) {
    if (db.get('tracks').count > 0 && db.get('tracks').count === db.get('tracks').items.count()) {
      return db;
    }

    return db.set('tracks', new RemoteResource('created', { count: 0, items: List() }));
  });

  watch('tracks', function (prev, next, db) {
    if (RemoteResource.is(next) && next.status === 'created') {
      return loadInitial(db.get('vk'), db.get('user'), function (err, result) {
        if (err) {
          return console.log(err);
        }

        send('tracks:update', result);
      });
    }

    if (RemoteResource.is(next) && next.status !== 'done') {
      return loadRemote(next, db.get('vk'), db.get('user'), function (err, result) {
        if (err) {
          return console.log(err);
        }

        send('tracks:update', result);
      });
    }

    if (RemoteResource.is(next) && next.status === 'done') {
      send('tracks:update', next.data);
    }
  });
};