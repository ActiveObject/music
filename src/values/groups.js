function Groups(vkIndex, send) {
  this.vkIndex = vkIndex;
  this.send = send;
}

Groups.prototype.take = function (count) {
  if (!this.vkIndex.isBuilt && !this.vkIndex.isBuilding()) {
    this.send('groups:index:update', this.vkIndex.build());
  }

  return this.vkIndex.items.take(count);
};

Groups.prototype.setIndex = function (index) {
  return new Groups(index, this.send);
};

Groups.prototype.findById = function (id) {
  return this.vkIndex.items.find(function (group) {
    return group.id === id;
  });
};

module.exports = Groups;