var transit = require('transit-js');
var Imm = require('immutable');
var each = require('underscore').each;

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

function CachedReader(config) {
  if (!(this instanceof CachedReader)) {
    return new CachedReader(config);
  }

  each(config, function(fn, tag) {
    var cache = {
      fromId: transit.map(),
      curId: 1
    };

    this[tag] = function(v) {
      var ret = fn(v);
      cache.fromId.set(cache.curId++, ret);
      return ret;
    };

    this[`cache:${tag}`] = (v, h) => cache.fromId.get(v);
  }, this);
}

function TimeRecord(history) {
  this.history = history;
}

TimeRecord.fromTransit = function(v) {
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

  // var process = function (items, res) {
  //   if (items.length === 0) {
  //     console.log('done');
  //     return callback('[' + res.join(',') + ']');
  //   }

  //   console.log('processing... (%s)', (1 - items.length / records.length) * 100);
  //   var ret = writer.write(items.slice(0, 1));
  //   res.push(ret);
  //   setTimeout(() => process(items.slice(1), res), 0);
  // };

  // process(records, []);
  return writer.write(records);
};

module.exports = TimeRecord;
