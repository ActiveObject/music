var List = require('immutable').List;
var merge = require('app/utils').merge;
var Track = require('app/values/track');
var VkIndex = require('app/values/vk-index');

function Tracks(attrs) {
  this.createdAt = new Date();
  this.vkIndex = attrs.vkIndex;
  this.datoms = this.vkIndex.items;

  this.eavt = this.datoms.groupBy(function (datom) {
    return datom[0];
  });

  this.all = List(this.eavt.map(Track.fromDatoms).values()).sortBy(function (track) {
    return track.index;
  });
}

Tracks.empty = new Tracks({
  vkIndex: VkIndex.empty
});

Tracks.prototype.size = function () {
  return this.all.size;
};

Tracks.prototype.first = function () {
  return this.all.first();
};

Tracks.prototype.modify = function (attrs) {
  return new Tracks(merge(this, attrs));
};

Tracks.prototype.getAll = function () {
  return this.all;
};

module.exports = Tracks;