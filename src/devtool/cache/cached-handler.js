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

module.exports = CachedHandler;
