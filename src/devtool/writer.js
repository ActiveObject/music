var transit = require('transit-js');
var Imm = require('immutable');
var AppCachedHandler = require('./cache/app-cached-handler');
var CachedHandler = require('./cache/cached-handler');

var MainRoute = require('app/routes/main-route');
var GroupRoute = require('app/routes/group-route');
var Track = require('app/values/track');
var Audio = require('app/values/audio');
var Group = require('app/values/group');
var Album = require('app/values/album');
var NewsfeedActivity = require('app/values/newsfeed-activity');
var LastNWeeksDRange = require('app/values/last-nweeks-drange');
var player = require('app/values/player');

module.exports = function createWriter(type) {
  return transit.writer(type, {
    handlers: transit.map([
      Imm.List, (new CachedHandler('immutable-list', (v) => v.toArray())),
      Imm.Map, (new CachedHandler('immutable-map', (v) => v.toObject())),
      Imm.Set, (new CachedHandler('immutable-set', (v) => v.toArray())),
      Imm.OrderedMap, (new CachedHandler('immutable-ordered-map', (v) => v.toArray().filter(x => x))),

      Audio, (new AppCachedHandler('audio')),
      Track, (new AppCachedHandler('track')),
      player.constructor, (new AppCachedHandler(':app/player')),
      MainRoute, (new AppCachedHandler('main-route')),
      GroupRoute, (new AppCachedHandler('group-route')),
      Group, (new AppCachedHandler('group')),
      Album, (new AppCachedHandler(':app/album')),
      NewsfeedActivity, (new AppCachedHandler('newsfeed-activity')),
      LastNWeeksDRange, (new AppCachedHandler('last-nweeks-drange'))
    ])
  });
};
