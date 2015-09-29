var ISet = require('immutable').Set;
var Kefir = require('kefir');
var go = require('app/core/go');
var GroupsLoader = require('app/processes/groups-loader');
var TracksLoader = require('app/processes/tracks-loader');
var AlbumsLoader = require('app/processes/albums-loader');
var addTag = require('app/fn/addTag');
var { addTag: addTag2, hasTag } = require('app/Tag');
var subscribeWith = require('app/fn/subscribeWith');
var onValue = require('app/fn/onValue');
var vk = require('app/vk');
var merge = require('app/fn/merge');
var db = require('app/db');
var userAtom = require('app/db/user');
var Atom = require('app/core/atom');

module.exports = function(vbus) {
  var user = vbus.filter(v => hasTag(v, ':user/authenticated'));

  return subscribeWith(onValue, Atom.listen, function (onValue, listen) {
    onValue(user, function (user) {
      var tout = go(new TracksLoader(user))
        .reduce((acc, v) => acc.union(v), ISet())
        .map(addTag(':app/tracks'));

      var gout = go(new GroupsLoader(user))
        .reduce((acc, v) => acc.union(v), ISet())
        .map(addTag(':app/groups'));

      var aout = go(new AlbumsLoader(user))
        .reduce((acc, v) => acc.union(v), ISet())
        .map(addTag(':app/albums'));

      vbus.plug(tout);
      vbus.plug(gout);
      vbus.plug(aout);
    });

    onValue(user.toProperty().sampledBy(Kefir.interval(2 * 60 * 1000)), function (user) {
      var out = go(new TracksLoader(user))
        .reduce((acc, v) => acc.union(v), ISet())
        .map(addTag(':app/tracks'));

      vbus.plug(out);
    });

    onValue(user.toProperty().sampledBy(Kefir.interval(10 * 60 * 1000)), function (user) {
      var out = go(new GroupsLoader(user))
        .reduce((acc, v) => acc.union(v), ISet())
        .map(addTag(':app/groups'));

      vbus.plug(out);
    });

    onValue(user.toProperty().sampledBy(Kefir.interval(10 * 60 * 1000)), function (user) {
      var out = go(new AlbumsLoader(user))
        .reduce((acc, v) => acc.union(v), ISet())
        .map(addTag(':app/albums'));

      vbus.plug(out);
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

        vbus.emit(addTag2(u, ':user/is-loaded'));
      });
    });
  });
};
