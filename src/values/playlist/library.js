var BasePlaylist = require('app/values/playlist/base');
var merge = require('app/utils').merge;

function LibraryPlaylist(attrs) {
  BasePlaylist.call(this, attrs);

  this.type = 'library';
  this.name = 'All tracks';
  this.tracks = attrs.tracks;
}

LibraryPlaylist.prototype = Object.create(BasePlaylist.prototype, {
  constructor: { value: LibraryPlaylist, enumerable: false }
});

LibraryPlaylist.prototype.update = function(library) {
  return this.modify({ tracks: library.getAll() });
};

LibraryPlaylist.prototype.recentTag = function () {
  return this.type;
};

LibraryPlaylist.prototype.modify = function(attrs) {
  return new LibraryPlaylist(merge(this, attrs));
};


module.exports = LibraryPlaylist;
