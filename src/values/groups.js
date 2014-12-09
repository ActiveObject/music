var List = require('immutable').List;
var ISet = require('immutable').Set;
var merge = require('app/utils').merge;
var group = require('app/values/group');

function Groups(attrs) {
  this.items = attrs.items;
}

Groups.prototype.take = function (count) {
  return this.items.take(count);
};

Groups.prototype.findById = function (id) {
  return this.items.find(function (group) {
    return group.id === id;
  });
};

Groups.prototype.fromVkResponse = function(res) {
  var groups = res.items.map(function(vkData) {
    return group.modify(vkData);
  });

  return new Groups({
    items: new ISet(groups)
  });
};

Groups.prototype.merge = function(otherGroups) {
  return new Groups({
    items: this.items.union(otherGroups.items)
  });
};

Groups.prototype.modify = function (attrs) {
  return new Groups(merge(this, attrs));
};

module.exports = new Groups({
  items: new ISet()
});
