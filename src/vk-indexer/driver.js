import Kefir from 'kefir';
import equal from 'deep-equal';
import { addTag, hasTag } from 'app/Tag';
import subscribeWith from 'app/subscribeWith';
import onValue from 'app/onValue';
import vk from 'app/vk';
import merge from 'app/merge';
import app from 'app';
import Atom from 'app/Atom';
import * as Album from 'app/Album';

export default function () {
  var user = Kefir.fromEvents(app, 'change').filter(v => hasTag(v.get(':db/user'), ':user/authenticated'));
  var userAtom = app.view(':db/user', equal);

  return subscribeWith(onValue, Atom.listen, function (onValue, listen) {
    onValue(user, function (user) {
      onValue(loadTracks(user), function (v) {
        app.push(addTag({ tracks: v }, ':vk/tracks'));
      });

      onValue(loadAlbums(user), function (v) {
        app.push(addTag({ albums: v }, ':vk/albums'));
      });
    });

    onValue(user.toProperty().sampledBy(Kefir.interval(2 * 60 * 1000)), function (user) {
      onValue(loadTracks(user), function (v) {
        app.push(addTag({ tracks: v }, ':vk/tracks'));
      });
    });

    onValue(user.toProperty().sampledBy(Kefir.interval(10 * 60 * 1000)), function (user) {
      onValue(loadAlbums(user), function (v) {
        app.push(addTag({ albums: v }, ':vk/albums'));
      });
    });

    listen(userAtom, function (user) {
      if (!hasTag(user, ':user/authenticated')) {
        return;
      }

      vk.users.get({
        user_ids: user.id,
        fields: ['photo_50']
      }, function (err, result) {
        if (err) {
          return console.log(err);
        }

        var res = result.response[0];

        var u = merge(app.value.get(':db/user'), {
          photo50: res.photo_50,
          firstName: res.first_name,
          lastName: res.last_name
        });

        app.push(addTag(u, ':user/is-loaded'));
      });
    });
  });
}

function loadTracks(user) {
  function load(offset, count, callback) {
    vk.audio.get({
      user_id: user.id,
      offset: offset,
      count: count
    }, callback);
  }

  function parse(res, offset) {
    return res.response.items.map(function (data, i) {
      return merge(data, { index: offset + i });
    });
  }

  return loadAll(load, parse);
}

function loadAlbums(user) {
  function load(offset, count, callback) {
    vk.audio.getAlbums({
      user_id: user.id,
      offset: offset,
      count: count
    }, callback);
  }

  function parse(res) {
    return res.response.items.map(Album.fromVk);
  }

  return loadAll(load, parse);
}

function loadAll(loadResource, parseResponse) {
  return Kefir.stream(function (emitter) {
    function load(offset, count) {
      loadResource(offset, count, function(err, res) {
        if (err) {
          return emitter.error(err);
        }

        emitter.emit(parseResponse(res, offset, count));

        if (res.response.count > 0 && res.response.count > offset + count) {
          return load(offset + count, count);
        }

        emitter.end();
      });
    }

    load(0, 1000);
  });
}
