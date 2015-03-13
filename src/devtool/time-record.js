var transit = require('transit-js');
var Imm = require('immutable');

var MainRoute = require('app/routes/main-route');
var Track = require('app/values/track');
var Group = require('app/values/group');
var NewsfeedActivity = require('app/values/newsfeed-activity');
var User = require('app/values/user');
var player = require('app/values/player');

function AppCachedHandler(tag) {
  this.cache = {
    toId: transit.map(),
    curId: 1
  };

  this.cacheTag = `cache:${tag}`;
}

AppCachedHandler.prototype.tag = function(v, h) {
  if (this.cache.toId.get(v)) {
    return this.cacheTag;
  }

  return v.tag();
};

AppCachedHandler.prototype.rep = function(v, h) {
  var id = this.cache.toId.get(v);

  if (id) {
    return id;
  }

  this.cache.toId.set(v, this.cache.curId++);

  return v.rep();
};

function TimeRecord(history) {
  this.history = history;
}

TimeRecord.fromTransit = function(v) {
  var cache1 = {
    fromId: transit.map(),
    curId: 1
  };

  var cache2 = {
    fromId: transit.map(),
    curId: 1
  };

  var cache3 = {
    fromId: transit.map(),
    curId: 1
  };

  var cache4 = {
    fromId: transit.map(),
    curId: 1
  };

  var cache5 = {
    fromId: transit.map(),
    curId: 1
  };

  var cache6 = {
    fromId: transit.map(),
    curId: 1
  };

  var cache7 = {
    fromId: transit.map(),
    curId: 1
  };

  var cache8 = {
    fromId: transit.map(),
    curId: 1
  };

  var cache9 = {
    fromId: transit.map(),
    curId: 1
  };

  var cache10 = {
    fromId: transit.map(),
    curId: 1
  };

  var cache11 = {
    fromId: transit.map(),
    curId: 1
  };

  function addToCache(cache, fn, ctx) {
    return function(v) {
      var ret = ctx ? fn.call(ctx, v) : fn(v);
      cache.fromId.set(cache.curId++, ret);
      return ret;
    };
  }

  var reader = transit.reader('json', {
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
    handlers: {
      'immutable-list': addToCache(cache1, v => Imm.List(v)),
      'immutable-map': addToCache(cache2, v => Imm.Map(v)),
      'immutable-set': addToCache(cache3, arr => Imm.Set(arr)),
      'immutable-ordered-map': addToCache(cache4, arr => Imm.OrderedMap(arr)),

      'audio': addToCache(cache5, Track.Audio.fromTransit),
      'track': addToCache(cache6, Track.fromTransit),
      'player': addToCache(cache7, player.fromTransit, player),
      'main-route': addToCache(cache8, MainRoute.fromTransit),
      'authenticated-user': addToCache(cache9, User.Authenticated.fromTransit),
      'group': addToCache(cache10, Group.fromTransit),
      'newsfeed-activity': addToCache(cache11, NewsfeedActivity.fromTransit),

      'cache:immutable-list': (v, h) => cache1.fromId.get(v),
      'cache:immutable-map': (v, h) => cache2.fromId.get(v),
      'cache:immutable-set': (v, h) => cache3.fromId.get(v),
      'cache:immutable-ordered-map': (v, h) => cache4.fromId.get(v),

      'cache:audio': (v, h) => cache5.fromId.get(v),
      'cache:track': (v, h) => cache6.fromId.get(v),
      'cache:player': (v, h) => cache7.fromId.get(v),
      'cache:main-route': (v, h) => cache8.fromId.get(v),
      'cache:authenticated-user': (v, h) => cache9.fromId.get(v),
      'cache:group': (v, h) => cache10.fromId.get(v),
      'cache:newsfeed-activity': (v, h) => cache11.fromId.get(v),
    }
  });

  return new TimeRecord(reader.read(v));
};

TimeRecord.prototype.play = function(app, render) {
  app.pause();

  var next = (items) => {
    if (items.length === 0) {
      return app.resume();
    }

    if (items.length === 1) {
      render(items[0].value);
      return app.resume();
    }

    render(items[0].value);
    setTimeout(next.bind(null, items.slice(1)), items[1].time - items[0].time);
  };

  next(this.history);
};

function CachedHandler(valueTag, transformFn) {
  this.cache = {
    toId: transit.map(),
    curId: 1
  };

  this.valueTag = valueTag;
  this.cacheTag = `cache:${valueTag}`;
  this.transformFn = transformFn;
}

CachedHandler.prototype.tag = function (v, h) {
  if (this.cache.toId.get(v)) {
    return this.cacheTag;
  }

  return this.valueTag;
};

CachedHandler.prototype.rep = function(v, h) {
  var id = this.cache.toId.get(v);

  if (id) {
    return id;
  }

  this.cache.toId.set(v, this.cache.curId++);
  return this.transformFn(v);
};

TimeRecord.prototype.toTransit = function(callback) {
  var propsToOmit = ['vk', 'soundmanager'];

  var writer = transit.writer('json', {
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

  var records = this.history.map(function(v) {
    return {
      time: v.time,
      value: v.value.filterNot((v, k) => propsToOmit.indexOf(k) !== -1)
    };
  });

  var process = function (items, res) {
    if (items.length === 0) {
      console.log('done');
      return callback('[' + res.join(',') + ']');
    }

    console.log('processing... (%s)', (1 - items.length / records.length) * 100);
    var ret = writer.write(items.slice(0, 1));
    res.push(ret);
    setTimeout(() => process(items.slice(1), res), 0);
  };

  process(records, []);
};

module.exports = TimeRecord;
