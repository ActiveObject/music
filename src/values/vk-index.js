var _ = require('underscore');
var List = require('immutable').List;
var VkChunk = require('app/values/vk-chunk');
var getOrDefault = require('app/utils').getOrDefault;

function Index(isBuilt, items, chunkToLoad, itemConstructor) {
  this.createdAt = new Date();
  this.isBuilt = isBuilt;
  this.items = items;
  this.chunkToLoad = chunkToLoad;
  this.itemConstructor = itemConstructor;
}

Index.prototype.build = function () {
  return this.modify({ chunkToLoad: new VkChunk(0, 1000) });
};

Index.prototype.isBuilding = function () {
  return VkChunk.is(this.chunkToLoad);
};

Index.prototype.fromVkResponse = function (res) {
  var items = this.items.concat(res.items.map(this.itemConstructor));

  if (res.count > 0 && res.count === items.count()) {
    return this.modify({
      items: items,
      isBuilt: true,
      chunkToLoad: null
    });
  }

  return this.modify({
    items: items,
    chunkToLoad: this.chunkToLoad.next(1000)
  });
};

Index.prototype.modify = function (attrs) {
  var isBuilt = getOrDefault(attrs, 'isBuilt', this.isBuilt),
      items = getOrDefault(attrs, 'items', this.items),
      chunkToLoad = getOrDefault(attrs, 'chunkToLoad', this.chunkToLoad),
      itemConstructor = getOrDefault(attrs, 'itemConstructor', this.itemConstructor);

  return new Index(isBuilt, items, chunkToLoad, itemConstructor);
};

module.exports = Index;
module.exports.empty = new Index(false, List());
