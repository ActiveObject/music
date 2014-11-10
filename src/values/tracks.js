var _ = require('underscore');
var List = require('immutable').List;
var Track = require('app/values/track');
var VkIndex = require('app/values/vk-index');
var PouchIndex = require('app/values/pouch-index');

function Tracks(attrs) {
  this.createdAt = new Date();
  this.vkIndex = attrs.vkIndex;
  this.send = attrs.send;
  this.datoms = this.vkIndex.items;
  this.localIndex = attrs.localIndex.push(this.datoms);

  this.eavt = this.datoms.groupBy(function (datom) {
    return datom[0];
  });

  this.all = List(this.eavt.map(Track.fromDatoms).values()).sortBy(function (track) {
    return track.index;
  });
}

Tracks.empty = new Tracks({
  vkIndex: new VkIndex({
    isBuilt: false,
    items: List(),
    chunkSize: 1000,
    transformFn: function (item, i) {
      var id = 'tracks/' + item.id;

      return [
        [id, ':track/artist', item.artist],
        [id, ':track/title', item.title],
        [id, ':track/duration', item.duration],
        [id, ':track/url', item.url],
        [id, ':track/lyrics_id', item.lyrics_id],
        [id, ':track/owner_id', item.owner_id],
        [id, ':track/vkid', item.id],
        [id, ':track/vk-index', i]
      ];
    }
  }),

  localIndex: PouchIndex.empty
});

Tracks.prototype.size = function () {
  return this.all.size;
};

Tracks.prototype.first = function () {
  return this.all.first();
};

Tracks.prototype.modify = function (attrs) {
  return new Tracks(_.extend({}, this, attrs));
};

Tracks.prototype.getAll = function () {
  if (!this.vkIndex.isBuilt && !this.vkIndex.isBuilding()) {
    this.send('tracks:vk-index:update', this.vkIndex.build());
  }

  if (!this.localIndex.isBuilt && !this.localIndex.isBuilding()) {
    this.send('tracks:local-index:update', this.localIndex.build());
  }

  return this.all;
};

module.exports = Tracks;