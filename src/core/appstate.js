var Immutable = require('immutable');
var SmartRef = require('app/core/smart-ref');
var player = require('app/values/player');
var tracks = require('app/values/tracks');
var groups = require('app/values/groups');
var layout = require('app/layout');
var vk = require('app/vk');
var sm = require('app/soundmanager');

var initialState = Immutable.Map({
  activity: require('app/fixtures/activity'),
  player: player,
  groups: groups,
  tracks: tracks,
  layout: layout.state,
  vk: vk.state,
  soundmanager: sm.state
});

module.exports = new SmartRef(initialState);

module.exports.toJSON = function() {
  return this.value.filterNot(function(val, key) {
    return key === 'soundmanager';
  }).toJSON();
};

module.exports.update = function update(key, updater) {
  return function updateDb(db) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(db.get(key));
    return db.set(key, updater.apply(db, args));
  };
};
