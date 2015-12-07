import Atom from 'app/Atom';
import app from 'app';
import vk from 'app/vk';
import merge from 'app/merge';
import { hasTag } from 'app/Tag';

export default function () {
  vk.onCaptcha = function (captchaUrl) {
    Atom.swap(app, app.value.set(':db/vk', {
      tag: ':vk/captcha-needed',
      captchaUrl: captchaUrl
    }));

    return new Promise(function (resolve, reject) {
      var unsub = Atom.listen(app, function (dbVal) {
        if (hasTag(dbVal.get(':db/vk'), ':vk/captcha-entered')) {
          Atom.swap(app, dbVal.set(':db/vk', { tag: [] }));
          resolve(dbVal.get(':db/vk').captchaKey);
          unsub();
        }
      })
    });
  };

  return Atom.listen(app, function (dbVal) {
    var user = dbVal.get(':db/user');

    if (hasTag(user, ':user/authenticated')) {
      vk.authorize(user);
    }
  });
}
