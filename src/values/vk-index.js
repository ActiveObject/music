var _ = require('underscore');
var List = require('immutable').List;
var VkChunk = require('app/values/vk-chunk');

function VkIndex(attrs) {
  this.createdAt = new Date();
  this.isBuilt = attrs.isBuilt;
  this.items = attrs.items;
  this.chunkToLoad = attrs.chunkToLoad;
  this.chunkSize = attrs.chunkSize;
  this.transformFn = attrs.transformFn;
}

VkIndex.prototype.build = function () {
  return this.modify({ chunkToLoad: new VkChunk(0, this.chunkSize) });
};

VkIndex.prototype.isBuilding = function () {
  return VkChunk.is(this.chunkToLoad);
};

VkIndex.prototype.fromVkResponse = function (res) {
  var offset = this.chunkToLoad.offset,

      newDatoms = res.items.map(function (item, i) {
        return this.transformFn(item, offset + i);
      }, this),

      items = this.items.concat(_.flatten(newDatoms, true));

  if (res.count > 0 && this.chunkToLoad.offset + this.chunkToLoad.count >= res.count) {
    return this.modify({
      items: items,
      isBuilt: true,
      chunkToLoad: null
    });
  }

  return this.modify({
    items: items,
    chunkToLoad: this.chunkToLoad.next(this.chunkSize)
  });
};

VkIndex.prototype.load = function (vk, user, callback) {
  var index = this;

  vk.audio.get({
    owner_id: user.id,
    offset: index.chunkToLoad.offset,
    count: index.chunkToLoad.count,
    v: '5.25'
  }, function (err, result) {
    if (err) {
      return callback(err);
    }

    callback(null, index.fromVkResponse(result.response));
  });
};

VkIndex.prototype.modify = function (attrs) {
  return new VkIndex(_.extend({}, this, attrs));
};

module.exports = VkIndex;
