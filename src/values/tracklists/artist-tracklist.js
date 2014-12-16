var uuid = require('uuid');
var merge = require('app/utils').merge;

function ArtistTracklist(attrs) {
  this.id = uuid.v4();
  this.type = 'artist';
  this.name = attrs.artist;
  this.artist = attrs.artist;
  this.playlist = attrs.playlist;
}

ArtistTracklist.prototype.update = function (library) {
  return this.modify({
    playlist: this.playlist.modify({ tracks: library.findByArtist(this.artist) })
  });
};

ArtistTracklist.prototype.recentTag = function () {
  return this.type + ':' + this.name;
};

ArtistTracklist.prototype.modify = function (attrs) {
  return new ArtistTracklist(merge(this, attrs));
};


module.exports = ArtistTracklist;
