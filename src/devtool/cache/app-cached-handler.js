var transit = require('transit-js');

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

module.exports = AppCachedHandler;
