var List = require('immutable').List;
var Tracks = require('app/values/tracks');
var merge = require('app/utils').merge;

function Playlist(attrs) {
  this.id = attrs.id;
  this.name = attrs.name;
  this.isShuffled = attrs.isShuffled;
  this.isRepeated = attrs.isRepeated;
  this.selectTracks = attrs.selectTracks;
  this.tracks = this.selectTracks(attrs.library);
}

Playlist.all = new Playlist({
  id: 'all',
  name: 'All tracks',
  isShuffled: false,
  isRepeated: false,
  selectTracks: function (library) {
    return library.getAll();
  },

  library: Tracks.empty
});

Playlist.prototype.update = function (library) {
  return this.modify({ library: library });
};

Playlist.prototype.isLastTrack = function (track) {
  var activeIndex = this.tracks.findIndex(function (t) {
    return t.id === track.id;
  });

  return activeIndex === this.tracks.count();
};

Playlist.prototype.nextAfter = function (track) {
  var activeIndex = this.tracks.findIndex(function (t) {
    return t.id === track.id;
  });

  return this.tracks.get(activeIndex + 1);
};

Playlist.prototype.modify = function(attrs) {
  return new Playlist(merge(this, attrs));
};

module.exports = Playlist;