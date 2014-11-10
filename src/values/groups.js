var _ = require('underscore');
var List = require('immutable').List;
var VkIndex = require('app/values/vk-index');

function Groups(attrs) {
  this.vkIndex = attrs.vkIndex;
  this.send = attrs.send;
  this.all = List();
}

Groups.empty = new Groups({
  vkIndex: new VkIndex({
    isBuilt: false,
    items: List(),
    chunkSize: 100,
    transformFn: function (item, i) {
      var id = 'groups/' + item.id;

      return [
        [id, ':group/type', item.type],
        [id, ':group/name', item.name],
        [id, ':group/screen_name', item.screen_name],
        [id, ':group/photo_50', item.photo_50],
        [id, ':group/photo_100', item.photo_100],
        [id, ':group/photo_200', item.photo_200],
        [id, ':group/is_closed', Boolean(item.is_closed)],
        [id, ':group/is_admin', Boolean(item.is_admin)],
        [id, ':group/is_member', Boolean(item.is_member)],
        [id, ':group/vkid', item.id],
        [id, ':group/vk-index', i]
      ];
    }
  })
});

Groups.prototype.take = function (count) {
  if (!this.vkIndex.isBuilt && !this.vkIndex.isBuilding()) {
    this.send('groups:index:update', this.vkIndex.build());
  }

  return this.all.take(count);
};

Groups.prototype.modify = function (attrs) {
  return new Groups(_.extend({}, this, attrs));
};

Groups.prototype.setIndex = function (index) {
  return this.modify({ vkIndex: index });
};

Groups.prototype.findById = function (id) {
  return this.vkIndex.all.find(function (group) {
    return group.id === id;
  });
};

module.exports = Groups;