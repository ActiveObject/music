var uuid = require('uuid');
var merge = require('app/utils/merge');

function GenreTracklist(attrs) {
  this.id = uuid.v4();
  this.type = 'genre';
  this.name = attrs.name;
  this.genre = attrs.genre;
  this.playlist = attrs.playlist;
}

GenreTracklist.prototype.update = function (library) {
  var tracks = library.toList().filter(track => track.album === this.genre);

  return this.modify({
    playlist: this.playlist.modify({ tracks: tracks })
  });
};

GenreTracklist.prototype.recentTag = function () {
  return this.type + ':' + this.name;
};

GenreTracklist.prototype.modify = function (attrs) {
  return new GenreTracklist(merge(this, attrs));
};


module.exports = GenreTracklist;
