import Kefir from 'kefir';
import equal from 'deep-equal';
import TracksLoader from './tracks-loader';
import AlbumsLoader from './albums-loader';
import { addTag, hasTag } from 'app/Tag';
import subscribeWith from 'app/subscribeWith';
import onValue from 'app/onValue';
import vk from 'app/vk';
import merge from 'app/merge';
import db from 'app/db';
import Atom from 'app/Atom';
import go from './go';

export default function(vbus) {
  var user = Kefir.fromEvents(vbus).filter(v => hasTag(v, ':user/authenticated'));
  var userAtom = db.view(':db/user', equal);

  return subscribeWith(onValue, Atom.listen, function (onValue, listen) {
    onValue(user, function (user) {
      onValue(go(new TracksLoader(user)).map(v => addTag({ tracks: v }, ':vk/tracks')), function (tracks) {
        vbus.push(tracks);
      });

      onValue(go(new AlbumsLoader(user)).map(v => addTag({ albums: v }, ':vk/albums')), function (albums) {
        vbus.push(albums);
      })
    });

    onValue(user.toProperty().sampledBy(Kefir.interval(2 * 60 * 1000)), function (user) {
      onValue(go(new TracksLoader(user)).map(v => addTag({ tracks: v }, ':vk/tracks')), function (tracks) {
        vbus.push(tracks)
      })
    });

    onValue(user.toProperty().sampledBy(Kefir.interval(10 * 60 * 1000)), function (user) {
      onValue(go(new AlbumsLoader(user)).map(v => addTag({ albums: v }, ':vk/albums')), function (albums) {
        vbus.push(albums)
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

        var u = merge(db.value.get(':db/user'), {
          photo50: res.photo_50,
          firstName: res.first_name,
          lastName: res.last_name
        });

        vbus.push(addTag(u, ':user/is-loaded'));
      });
    });
  });
}
