var Immutable = require('immutable');
var SmartRef = require('app/core/smart-ref');
var Auth = require('app/core/auth');
var Player = require('app/values/player');
var Tracks = require('app/values/tracks');
var Groups = require('app/values/groups');
var Layout = require('app/layouts');
var vk = require('app/vk');

if (Auth.hasToken(location.hash)) {
  Auth.storeToLs(location.hash);
  location.hash = '';
}

var initialState = Immutable.Map({
  activity: require('app/fixtures/activity'),
  player: Player.empty,
  groups: Groups.empty,
  tracks: Tracks.empty,
  layout: Layout.empty,
  vk: vk.state,
  user: Auth.readFromLs()
});

module.exports = new SmartRef(initialState);

module.exports.update = function update(key, updater) {
  return function updateDb(db) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(db.get(key));
    return db.set(key, updater.apply(db, args));
  };
};
