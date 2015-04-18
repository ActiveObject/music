var uuid = require('uuid');
var merge = require('app/fn/merge');

function LibraryTracklist(attrs) {
  this.id = uuid.v4();
  this.type = 'library';
  this.name = 'All tracks';
  this.playlist = attrs.playlist;
}

LibraryTracklist.prototype.update = function(library) {
  var tracks = library.toList().sortBy(function(track) {
    return track.audio.index;
  });

  return this.modify({
    playlist: this.playlist.modify({ tracks: tracks })
  });
};

LibraryTracklist.prototype.recentTag = function () {
  return this.type;
};

LibraryTracklist.prototype.modify = function(attrs) {
  return new LibraryTracklist(merge(this, attrs));
};

module.exports = LibraryTracklist;
