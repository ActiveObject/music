var List = require('immutable').List;
var RemoteResource = require('app/values/remote-resource');
var Group = require('app/values/group');
var getOrDefault = require('app/utils').getOrDefault;

function Groups(count, items, send) {
  this.count = count;
  this.items = items;
  this.send = send;
}

Groups.prototype.isLoading = function () {
  return RemoteResource.is(this.items);
};

Groups.prototype.take = function (count) {
  if (this.isLoading()) {
    return this.items.data.take(count);
  }

  if (this.items.count() > count) {
    return this.items.take(count);
  }

  if (this.items.count() === count) {
    return this.items;
  }

  this.send('groups:update', this.modify({
    items: new RemoteResource('created', this.items, { offset: 0, total: count })
  }));

  return this.items;
};

Groups.prototype.modify = function (attrs) {
  var count = getOrDefault(attrs, 'count', this.count),
      items = getOrDefault(attrs, 'items', this.items),
      send = getOrDefault(attrs, 'send', this.send);

  return new Groups(count, items, send);
};

Groups.prototype.fromVkResponse = function (res) {
  var items = this.items.data.concat(res.items.map(Group));

  if (items.count() >= this.items.options.total) {
    return this.modify({
      count: res.count,
      items: items
    });
  }

  return this.modify({
    count: res.count,
    items: new RemoteResource('inprogress', items, {
      offset: this.items.options.offset + 100,
      total: this.items.options.total
    })
  });
};

Groups.prototype.findById = function (id) {
  var items = this.isLoading() ? this.items.data : this.items;

  return items.find(function (group) {
    return group.id === id;
  });
};

module.exports = Groups;
module.exports.empty = new Groups(0, List());