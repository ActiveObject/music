var _ = require('underscore');
var List = require('immutable').List;
var RemoteResource = require('app/values/remote-resource');
var Track = require('app/values/track');
var getOrDefault = require('app/utils').getOrDefault;

function Tracks(count, items, send) {
  this.count = count;
  this.items = items;
  this.send = send;
}

Tracks.prototype.isLoaded = function () {
  return !this.isLoading() && this.count > 0 && this.count === this.items.count();
};

Tracks.prototype.size = function () {
  return this.isLoading() ? this.items.data.count() : this.items.count();
};

Tracks.prototype.first = function () {
  return this.isLoading() ? this.items.data.first() : this.items.first();
};

Tracks.prototype.getAll = function () {
  if (this.isLoaded()) {
    return this.items;
  }

  if (this.isLoading()) {
    return this.items.data;
  }

  this.send('tracks:update', this.modify({
    items: new RemoteResource('created', List(), { offset: 0 })
  }));

  return List();
};

Tracks.prototype.modify = function (attrs) {
  var count = getOrDefault(attrs, 'count', this.count),
      items = getOrDefault(attrs, 'items', this.items),
      send = getOrDefault(attrs, 'send', this.send);

  return new Tracks(count, items, send);
};

Tracks.prototype.isLoading = function () {
  return RemoteResource.is(this.items);
};

Tracks.prototype.fromVkResponse = function (res) {
  var items = this.items.data.concat(res.items.map(Track));

  if (res.count > 0 && res.count === items.count()) {
    return this.modify({
      count: res.count,
      items: items
    });
  }

  return this.modify({
    count: res.count,
    items: new RemoteResource('inprogress', items, { offset: this.items.options.offset + 1000 })
  });
};

module.exports = Tracks;
module.exports.empty = new Tracks(0, List());