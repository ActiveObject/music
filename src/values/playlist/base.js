var uuid = require('uuid');

function BasePlaylist(attrs) {
  this.id = uuid.v4();
  this.isShuffled = attrs.isShuffled;
  this.isRepeated = attrs.isRepeated;
}

BasePlaylist.prototype.isLastTrack = function (track) {
  var activeIndex = this.tracks.findIndex(function (t) {
    return t.id === track.id;
  });

  return (activeIndex + 1) === this.tracks.size;
};

BasePlaylist.prototype.nextAfter = function (track) {
  var activeIndex = this.tracks.findIndex(function (t) {
    return t.id === track.id;
  });

  return this.tracks.get(activeIndex + 1);
};

module.exports = BasePlaylist;
