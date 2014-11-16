var List = require('immutable').List;
var merge = require('app/utils').merge;
var VkIndex = require('app/values/vk-index');
var Group = require('app/values/group');

function Groups(attrs) {
  this.vkIndex = attrs.vkIndex;
  this.send = attrs.send;
  this.eavt = this.vkIndex.items.groupBy(function (datom) {
    return datom[0];
  });

  this.all = List(this.eavt.map(Group.fromDatoms).values());
}

Groups.empty = new Groups({
  vkIndex: VkIndex.empty
});

Groups.prototype.take = function (count) {
  return this.all.take(count);
};

Groups.prototype.modify = function (attrs) {
  return new Groups(merge(this, attrs));
};

Groups.prototype.setIndex = function (index) {
  return this.modify({ vkIndex: index });
};

Groups.prototype.findById = function (id) {
  return this.all.find(function (group) {
    return group.id === id;
  });
};

module.exports = Groups;