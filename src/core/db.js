var Immutable = require('immutable');
var SmartRef = require('app/core/smart-ref');
var Auth = require('app/core/auth');
var ActiveTrack = require('app/values/active-track');
var Tracks = require('app/values/tracks');
var Group = require('app/values/group');
var Groups = require('app/values/groups');
var Playqueue = require('app/values/playqueue');
var VkIndex = require('app/values/vk-index');
var PouchIndex = require('app/values/pouch-index');
var layouts = require('app/layouts');

if (Auth.hasToken(location.hash)) {
  Auth.storeToLs(location.hash);
  location.hash = '';
}

var initialState = Immutable.Map({
  activity: require('app/fixtures/activity'),
  activeTrack: ActiveTrack.empty,
  playqueue: Playqueue.empty,
  groups: Groups.empty,
  tracks: Tracks.empty.modify({
    localIndex: PouchIndex.empty.fromDb('/music/tracks'),
  }),
  user: Auth.readFromLs(),
  layout: layouts.empty
});

module.exports = new SmartRef(initialState);