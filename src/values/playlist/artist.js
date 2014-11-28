var BasePlaylist = require('app/values/playlist/base');
var merge = require('app/utils').merge;

function ArtistPlaylist(attrs) {
  BasePlaylist.call(this, attrs);

  this.type = 'artist';
  this.name = attrs.artist;
  this.artist = attrs.artist;
  this.tracks = attrs.library.findByArtist(attrs.artist);
}

ArtistPlaylist.prototype = Object.create(BasePlaylist.prototype, {
  constructor: { value: ArtistPlaylist, enumerable: false }
});

ArtistPlaylist.prototype.update = function (library) {
  return this.modify({
    library: library
  });
};

ArtistPlaylist.prototype.recentTag = function () {
  return this.type + ':' + this.name;
};

ArtistPlaylist.prototype.modify = function (attrs) {
  return new ArtistPlaylist(merge(this, attrs));
};


module.exports = ArtistPlaylist;
