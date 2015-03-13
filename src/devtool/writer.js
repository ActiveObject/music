var transit = require('transit-js');
var Imm = require('immutable');
var AppCachedHandler = require('./cache/app-cached-handler');
var CachedHandler = require('./cache/cached-handler');

var MainRoute = require('app/routes/main-route');
var Track = require('app/values/track');
var Group = require('app/values/group');
var NewsfeedActivity = require('app/values/newsfeed-activity');
var User = require('app/values/user');
var player = require('app/values/player');

module.exports = function createWriter(type) {
  return transit.writer(type, {
    handlers: transit.map([
      Imm.List, (new CachedHandler('immutable-list', (v) => v.toArray())),
      Imm.Map, (new CachedHandler('immutable-map', (v) => v.toObject())),
      Imm.Set, (new CachedHandler('immutable-set', (v) => v.toArray())),
      Imm.OrderedMap, (new CachedHandler('immutable-ordered-map', (v) => v.toArray().filter(x => x))),

      Track.Audio, (new AppCachedHandler('audio')),
      Track, (new AppCachedHandler('track')),
      player.constructor, (new AppCachedHandler('player')),
      MainRoute, (new AppCachedHandler('main-route')),
      User.Authenticated, (new AppCachedHandler('authenticated-user')),
      Group, (new AppCachedHandler('group')),
      NewsfeedActivity, (new AppCachedHandler('newsfeed-activity'))
    ])
  });
};
