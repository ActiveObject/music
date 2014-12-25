var merge = require('app/utils').merge;

function Playlist(attrs) {
  this.isShuffled = attrs.isShuffled;
  this.isRepeated = attrs.isRepeated;
  this.tracks = attrs.tracks;
}

Playlist.prototype.isLastTrack = function (track) {
  var activeIndex = this.tracks.findIndex(function (t) {
    return t.id === track.id;
  });

  return (activeIndex + 1) === this.tracks.size;
};

Playlist.prototype.nextAfter = function (track) {
  var activeIndex = this.tracks.findIndex(function (t) {
    return t.id === track.id;
  });

  return this.tracks.get(activeIndex + 1);
};

Playlist.prototype.playlist = function() {
  return this;
};

Playlist.prototype.modify = function(attrs) {
  return new Playlist(merge(this, attrs));
};

module.exports = Playlist;
