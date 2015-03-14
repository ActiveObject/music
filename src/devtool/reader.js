var transit = require('transit-js');
var Imm = require('immutable');
var CachedReader = require('./cache/cached-reader');

var MainRoute = require('app/routes/main-route');
var GroupRoute = require('app/routes/group-route');
var Track = require('app/values/track');
var Audio = require('app/values/audio');
var Group = require('app/values/group');
var NewsfeedActivity = require('app/values/newsfeed-activity');
var LastNWeekDrange = require('app/values/last-nweeks-drange');
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

      'audio': Audio,
      'track': Track,
      'player': v => player.fromTransit(v),
      'main-route': MainRoute,
      'group-route': GroupRoute,
      'authenticated-user': User.Authenticated,
      'group': Group,
      'newsfeed-activity': NewsfeedActivity,
      'last-nweeks-drange': v => new LastNWeekDrange(v, new Date())
    })
  });
};
