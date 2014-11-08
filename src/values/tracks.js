function Tracks(vkIndex, send) {
  this.createdAt = new Date();
  this.vkIndex = vkIndex;
  this.send = send;
}

Tracks.prototype.size = function () {
  return this.vkIndex.items.size;
};

Tracks.prototype.first = function () {
  return this.vkIndex.items.first();
};

Tracks.prototype.setIndex = function (nextVkIndex) {
  return new Tracks(nextVkIndex, this.send);
};

Tracks.prototype.getAll = function () {
  if (!this.vkIndex.isBuilt && !this.vkIndex.isBuilding()) {
    this.send('tracks:index:update', this.vkIndex.build());
  }

  return this.vkIndex.items.toList();
};

module.exports = Tracks;