var uuid = require('uuid');
var merge = require('app/fn/merge');

function ArtistTracklist(attrs) {
  this.id = uuid.v4();
  this.type = 'artist';
  this.name = attrs.artist;
  this.artist = attrs.artist;
  this.playlist = attrs.playlist;
}

ArtistTracklist.prototype.update = function (library) {
  var artist = this.artist;
  var tracks = library.toList().filter(function (track) {
    return track.artist === artist;
  });

  return this.modify({
    playlist: this.playlist.modify({ tracks: tracks })
  });
};

ArtistTracklist.prototype.recentTag = function () {
  return this.type + ':' + this.name;
};

ArtistTracklist.prototype.modify = function (attrs) {
  return new ArtistTracklist(merge(this, attrs));
};


module.exports = ArtistTracklist;
