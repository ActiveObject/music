import Atom from 'app/Atom';
import db from 'app/db';
import vk from 'app/vk';
import { hasTag } from 'app/Tag';

export default function (vbus) {
  return Atom.listen(db, function (dbVal) {
    var user = dbVal.get(':db/user');

    if (hasTag(user, ':user/authenticated')) {
      vk.authorize(user);
    }
  });
}
