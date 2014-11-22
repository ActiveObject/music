var List = require('immutable').List;
var Tracks = require('app/values/tracks');
var merge = require('app/utils').merge;

function Playlist(attrs) {
  this.id = attrs.id;
  this.name = attrs.name;
  this.isShuffled = attrs.isShuffled;
  this.isRepeated = attrs.isRepeated;
  this.tracks = attrs.tracks;
}

Playlist.prototype.setSource = function (source) {
  return this.modify({ tracks: source });
};

Playlist.prototype.getAll = function () {
  return this.tracks.getAll();
};

Playlist.prototype.isLastTrack = function (track) {
  var tracks = this.getAll();
  var activeIndex = tracks.findIndex(function (t) {
    return t.id === track.id;
  });

  return activeIndex === tracks.count();
};

Playlist.prototype.nextAfter = function (track) {
  var tracks = this.getAll();
  var activeIndex = tracks.findIndex(function (t) {
    return t.id === track.id;
  });

  return tracks.get(activeIndex + 1);
};

Playlist.prototype.modify = function(attrs) {
  return new Playlist(merge(this, attrs));
};

module.exports = Playlist;
module.exports.empty = new Playlist({
  tracks: Tracks.empty
});
