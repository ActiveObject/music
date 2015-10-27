import Atom from 'app/Atom';
import app from 'app';
import vk from 'app/vk';
import { hasTag } from 'app/Tag';

export default function () {
  return Atom.listen(app, function (dbVal) {
    var user = dbVal.get(':db/user');

    if (hasTag(user, ':user/authenticated')) {
      vk.authorize(user);
    }
  });
}
