var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var List = require('immutable').List;
var merge = require('app/utils').merge;

function Page(offset, count) {
  this.offset = offset;
  this.count = count;
}

Page.prototype.next = function (amount) {
  return new Page(this.offset + this.count, amount);
};

function VkIndexValue(attrs) {
  this.createdAt = new Date();
  this.isBuilt = attrs.isBuilt;
  this.isBuilding = attrs.isBuilding;
  this.items = attrs.items;
  this.chunkToLoad = attrs.chunkToLoad;
  this.chunkSize = attrs.chunkSize;
}

VkIndexValue.prototype.modify = function (attrs) {
  return new VkIndexValue(merge(this, attrs));
};

VkIndexValue.prototype.fromVkResponse = function (res, transformFn) {
  var offset = this.chunkToLoad.offset,

      newDatoms = res.items.map(function (item, i) {
        return transformFn(item, offset + i);
      }),

      items = this.items.concat(_.flatten(newDatoms, true));

  if (res.count > 0 && this.chunkToLoad.offset + this.chunkToLoad.count >= res.count) {
    return this.modify({
      items: items,
      isBuilt: true,
      isBuilding: false,
      chunkToLoad: null
    });
  }

  return this.modify({
    items: items,
    chunkToLoad: this.chunkToLoad.next(this.chunkSize)
  });
};


function VkIndex(attrs) {
  this.value = new VkIndexValue({
    isBuilt: false,
    isBuilding: false,
    items: List(),
    chunkToLoad: new Page(0, attrs.chunkSize),
    chunkSize: attrs.chunkSize
  });

  this.transformFn = attrs.transformFn;
  this.loadFn = attrs.loadFn;
}

VkIndex.empty = new VkIndexValue({
  isBuilt: false,
  isBuilding: false,
  items: List(),
  chunkToLoad: new Page(0, 100),
  chunkSize: 100
});

VkIndex.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: VkIndex, enumerable: false }
});

VkIndex.prototype.build = function (user) {
  var index = this.value;

  if (!index.isBuilt) {
    this.value.isBuilding = true;
    this.loadFn(user, this.value.chunkToLoad, function (err, result) {
      if (err) {
        return console.log(err);
      }

      this.value = this.value.fromVkResponse(result.response, this.transformFn);
      this.emit('load', this.value);
      this.build(user);
    }.bind(this));
  }
};

module.exports = VkIndex;
