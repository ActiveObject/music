var uuid = require('uuid');
var merge = require('app/utils').merge;

function LibraryTracklist(attrs) {
  this.id = uuid.v4();
  this.type = 'library';
  this.name = 'All tracks';
  this.playlist = attrs.playlist;
}

LibraryTracklist.prototype.update = function(library) {
  return this.modify({
    playlist: this.playlist.modify({ tracks: library.getAll() })
  });
};

LibraryTracklist.prototype.recentTag = function () {
  return this.type;
};

LibraryTracklist.prototype.modify = function(attrs) {
  return new LibraryTracklist(merge(this, attrs));
};

module.exports = LibraryTracklist;
