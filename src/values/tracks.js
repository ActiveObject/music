var List = require('immutable').List;
var merge = require('app/utils').merge;
var Track = require('app/values/track');
var VkIndex = require('app/values/vk-index');
var Database = require('app/core/database');

function Tracks(attrs) {
  this.db = attrs.db;
  this.cache = {};
}

Tracks.empty = new Tracks({ db: Database.empty });

Tracks.prototype.size = function () {
  return this.getAll().size;
};

Tracks.prototype.first = function () {
  return this.getAll().first();
};

Tracks.prototype.getAll = function () {
  return this.query('getAll', function () {
    return List(this.db.entities.map(Track.fromEntity).values()).sortBy(function (track) {
      return track.index;
    });
  });
};

Tracks.prototype.findByArtist = function (artist) {
  return this.query('findByArtist:' + artist, function () {
    return this.getAll().filter(function (track) {
      return track.artist === artist;
    });
  });
};

Tracks.prototype.modify = function (attrs) {
  return new Tracks(merge(this, attrs));
};

Tracks.prototype.query = function (key, fn) {
  console.time('query[' + key + ']');
  if (!this.cache[key]) {
    this.cache[key] = fn.call(this);
  }

  console.timeEnd('query[' + key + ']');
  return this.cache[key];
};

module.exports = Tracks;