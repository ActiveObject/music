var transit = require('transit-js');
var Imm = require('immutable');
var CachedReader = require('./cache/cached-reader');

var MainRoute = require('app/routes/main-route');
var Track = require('app/values/track');
var Group = require('app/values/group');
var NewsfeedActivity = require('app/values/newsfeed-activity');
var User = require('app/values/user');
var player = require('app/values/player');

module.exports = function createReader(type) {
  return transit.reader('json', {
    arrayBuilder: {
      init: () => [],
      add: function (ret, val) { ret.push(val); return ret; },
      finalize: ret => ret,
      fromArray: arr => arr
    },

    mapBuilder: {
      init: () => ({}),
      add: function (ret, key, val) { ret[key] = val; return ret; },
      finalize: ret => ret
    },

    handlers: CachedReader({
      'immutable-list': Imm.List,
      'immutable-map': Imm.Map,
      'immutable-set': Imm.Set,
      'immutable-ordered-map': Imm.OrderedMap,

      'audio': Track.Audio.fromTransit,
      'track': Track.fromTransit,
      'player': player.fromTransit.bind(player),
      'main-route': MainRoute.fromTransit,
      'authenticated-user': User.Authenticated.fromTransit,
      'group': Group.fromTransit,
      'newsfeed-activity': NewsfeedActivity.fromTransit
    })
  });
};
