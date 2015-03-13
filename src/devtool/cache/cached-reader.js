var transit = require('transit-js');
var each = require('underscore').each;

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

module.exports = CachedReader;
