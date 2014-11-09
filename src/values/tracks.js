var getOrDefault = require('app/utils').getOrDefault;

function Tracks(vkIndex, localIndex, send) {
  this.createdAt = new Date();
  this.vkIndex = vkIndex;
  this.localIndex = localIndex;
  this.send = send;
}

Tracks.prototype.size = function () {
  return this.vkIndex.items.size;
};

Tracks.prototype.first = function () {
  return this.vkIndex.items.first();
};

Tracks.prototype.modify = function (attrs) {
  var vkIndex = getOrDefault(attrs, 'vkIndex', this.vkIndex),
      localIndex = getOrDefault(attrs, 'localIndex', this.localIndex),
      send = getOrDefault(attrs, 'send', this.send);

  return new Tracks(vkIndex, localIndex, send);
};

Tracks.prototype.getAll = function () {
  if (!this.vkIndex.isBuilt && !this.vkIndex.isBuilding()) {
    this.send('tracks:vk-index:update', this.vkIndex.build());
  }

  if (!this.localIndex.isBuilt && !this.localIndex.isBuilding()) {
    this.send('tracks:local-index:update', this.localIndex.build());
  }

  return this.vkIndex.items.toList();
};

module.exports = Tracks;