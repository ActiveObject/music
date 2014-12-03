var _ = require('underscore');

function attrEquals (x, y) {
  return function(attr) {
    return x[attr] === y[attr];
  };
}

function Track(attrs) {
  if (!(this instanceof Track)) {
    return new Track(attrs);
  }

  this.id = Number(attrs.id);
  this.artist = attrs.artist;
  this.title = attrs.title;
  this.duration = attrs.duration;
  this.index = attrs.index;

  this.owner_id = attrs.owner_id;
  this.url = attrs.url;
}

Track.fromEntity = function (entity) {
  return new Track({
    id: entity[':track/vkid'],
    artist: entity[':track/artist'],
    title: entity[':track/title'],
    duration: entity[':track/duration'],
    owner_id: entity[':track/owner_id'],
    url: entity[':track/url'],
    index: entity[':track/vk-index']
  });
};

Track.prototype.toString = function() {
  return 'Track #' + this.id;
};

Track.prototype.hashCode = function() {
  return this.id;
};

Track.prototype.equals = function(other) {
  return [
    'id', 'artist', 'title', 'duration', 'index', 'owner_id', 'url'
  ].every(attrEquals(this, other));
};

Track.prototype.modify = function (attrs) {
  return new Track(_.extend({}, this, attrs));
};

Track.prototype.toDatoms = function () {
  var id = 'tracks/' + this.id;

  return [
    [id, ':track/title', this.title],
    [id, ':track/artist', this.artist],
    [id, ':track/duration', this.duration],
    [id, ':track/owner_id', this.owner_id],
    [id, ':track/url', this.url],
    [id, ':track/vkid', this.id],
    [id, ':track/vk-index', this.index]
  ];
};

module.exports = Track;
