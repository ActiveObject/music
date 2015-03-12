var transit = require('transit-js');
var Imm = require('immutable');

var MainRoute = require('app/routes/main-route');
var Track = require('app/values/track');
var Group = require('app/values/group');
var NewsfeedActivity = require('app/values/newsfeed-activity');
var User = require('app/values/user');
var player = require('app/values/player');

function AppValueHandler(cache) {
  this.cache = cache;
};

AppValueHandler.prototype.tag = function(v, h) {
  if (this.cache.toId.get(v)) {
    return 'cache';
  }

  return v.tag();
};

AppValueHandler.prototype.rep = function(v, h) {
  var id = this.cache.toId.get(v);

  if (id) {
    return id;
  }

  if (this.cache.curId < 10) {
    console.log(this.cache.curId, v.toJS ? v.toJS() : v);
  }

  this.cache.toId.set(v, this.cache.curId++);

  return v.rep();
};


function ImmutableMapHandler(cache) {
  this.cache = cache;
}

ImmutableMapHandler.prototype.tag = function(v, h) {
  if (this.cache.toId.get(v)) {
    return 'cache';
  }

  return 'immutable-map';
};

ImmutableMapHandler.prototype.rep = function(v, h) {
  var id = this.cache.toId.get(v);

  if (id) {
    return id;
  }

  if (this.cache.curId < 10) {
    console.log('Map', this.cache.curId, v.toJS ? v.toJS() : v);
  }

  this.cache.toId.set(v, this.cache.curId++);
  return v.toObject();
};


function ImmutableSetHandler(cache) {
  this.cache = cache;
}

ImmutableSetHandler.prototype.tag = function(v, h) {
  if (this.cache.toId.get(v)) {
    return 'cache';
  }

  return 'immutable-set';
};

ImmutableSetHandler.prototype.rep = function(v, h) {
  var id = this.cache.toId.get(v);

  if (id) {
    return id;
  }

  if (this.cache.curId < 10) {
    console.log('Set', this.cache.curId, v.toJS ? v.toJS() : v);
  }

  this.cache.toId.set(v, this.cache.curId++);
  return v.toArray();
};


function ImmutableListHandler(cache) {
  this.cache = cache;
}

ImmutableListHandler.prototype.tag = function(v, h) {
  if (this.cache.toId.get(v)) {
    return 'cache';
  }

  return 'immutable-list';
};

ImmutableListHandler.prototype.rep = function(v, h) {
  var id = this.cache.toId.get(v);

  if (id) {
    return id;
  }


  if (this.cache.curId < 10) {
    console.log('List', this.cache.curId, v.toJS ? v.toJS() : v);
  }


  this.cache.toId.set(v, this.cache.curId++);
  return v;
};


function ImmutableOrderedMapHandler(cache) {
  this.cache = cache;
}

ImmutableOrderedMapHandler.prototype.tag = function(v, h) {
  if (this.cache.toId.get(v)) {
    return 'cache';
  }

  return 'immutable-ordered-map';
};

ImmutableOrderedMapHandler.prototype.rep = function(v, h) {
  var id = this.cache.toId.get(v);

  if (id) {
    return id;
  }

  this.cache.toId.set(v, this.cache.curId++);
  return v.toArray().filter(x => x);
};


function TimeRecord(history) {
  this.history = history;
}

TimeRecord.fromTransit = function(v) {
  var cache = {
    fromId: transit.map(),
    curId: 1
  };

  function addToCache(fn, ctx) {
    return function(v) {
      var ret = ctx ? fn.call(ctx, v) : fn(v);
      if (cache.curId < 10) {
        console.log('addToCache:', cache.curId, v.toJS ? v.toJS() : v);
      }
      cache.fromId.set(cache.curId++, ret);
      return ret;
    };
  }

  var reader = transit.reader('json', {
    arrayBuilder: {
      init: () => [],
      add: (ret, val) => ret.push(val),
      finalize: ret => ret,
      fromArray: arr => arr
    },
    mapBuilder: {
      init: () => ({}),
      add: function (ret, key, val) { ret[key] = val; return ret; },
      finalize: ret => ret
    },
    handlers: {
      'immutable-list': addToCache(v => Imm.List(v)),
      'immutable-map': addToCache(v => Imm.Map(v)),
      'immutable-set': addToCache(arr => Imm.Set(arr)),
      'immutable-ordered-map': addToCache(arr => Imm.OrderedMap(arr)),

      'audio': addToCache(Track.Audio.fromTransit),
      'track': addToCache(Track.fromTransit),
      'player': addToCache(player.fromTransit, player),
      'main-route': addToCache(MainRoute.fromTransit),
      'authenticated-user': addToCache(User.Authenticated.fromTransit),
      'group': addToCache(Group.fromTransit),
      'newsfeed-activity': addToCache(NewsfeedActivity.fromTransit),

      'cache': (v, h) => cache.fromId.get(v)
    }
  });

  return new TimeRecord(reader.read(v));
};

TimeRecord.prototype.play = function(app, render) {
  app.pause();

  var next = (i) => {
    if (i >= this.history.length) {
      return app.resume();
    }

    render(this.history[i].value);

    if (i - 2 === this.history.length) {
      setTimeout(next.bind(this, i + 1), this.history[i].time - this.history[i - 1].time);
    } else {
      setTimeout(next.bind(this, i + 1), this.history[i + 1].time - this.history[i].time);
    }
  };

  next(0);
};

TimeRecord.prototype.toTransit = function() {
  var cache = {
    toId: transit.map(),
    curId: 1
  };

  var propsToOmit = ['vk', 'soundmanager'];

  var writer = transit.writer('json-verbose', {
    handlers: transit.map([
      Imm.List, (new ImmutableListHandler(cache)),
      Imm.Map, (new ImmutableMapHandler(cache)),
      Imm.Set, (new ImmutableSetHandler(cache)),
      Imm.OrderedMap, (new ImmutableOrderedMapHandler(cache)),

      'app-value', (new AppValueHandler(cache))
    ])
  });

  var record = this.history.map(function(v) {
    return {
      time: v.time,
      value: v.value.filterNot((v, k) => propsToOmit.indexOf(k) !== -1)
    }
  });

  return writer.write(record);
};

module.exports = TimeRecord;
