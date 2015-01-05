var _ = require('underscore');
var attrEquals = require('app/utils/attrEquals');

function Track(attrs) {
  this.id = Number(attrs.id);
  this.artist = attrs.artist;
  this.title = attrs.title;
  this.duration = attrs.duration;
  this.index = attrs.index;

  this.owner_id = attrs.owner_id;
  this.url = attrs.url;
}

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

module.exports = Track;
