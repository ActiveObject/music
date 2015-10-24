import Kefir from 'kefir';
import go from 'app/core/go';
import TracksLoader from './tracks-loader';
import AlbumsLoader from './albums-loader';
import { addTag, hasTag } from 'app/Tag';
import subscribeWith from 'app/fn/subscribeWith';
import onValue from 'app/fn/onValue';
import vk from 'app/vk';
import merge from 'app/fn/merge';
import db from 'app/db';
import userAtom from 'app/db/user';
import Atom from 'app/core/atom';

export default function(vbus) {
  var user = vbus.filter(v => hasTag(v, ':user/authenticated'));

  return subscribeWith(onValue, Atom.listen, function (onValue, listen) {
    onValue(user, function (user) {
      vbus.plug(go(new TracksLoader(user)).map(v => addTag({ tracks: v }, ':vk/tracks')));
      vbus.plug(go(new AlbumsLoader(user)).map(v => addTag({ albums: v }, ':vk/albums')));
    });

    onValue(user.toProperty().sampledBy(Kefir.interval(2 * 60 * 1000)), function (user) {
      vbus.plug(go(new TracksLoader(user)).map(v => addTag({ tracks: v }, ':vk/tracks')));
    });

    onValue(user.toProperty().sampledBy(Kefir.interval(10 * 60 * 1000)), function (user) {
      vbus.plug(go(new AlbumsLoader(user)).map(v => addTag({ albums: v }, ':vk/albums')));
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

        vbus.emit(addTag(u, ':user/is-loaded'));
      });
    });
  });
}