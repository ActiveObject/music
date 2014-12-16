var omit = require('underscore').omit;
var List = require('immutable').List;
var ISet = require('immutable').Set;
var merge = require('app/utils').merge;
var Track = require('app/values/track');
var ArtistTracklist = require('app/values/tracklists/artist-tracklist');
var Playlist = require('app/values/playlist');

function Tracks(attrs) {
  this.items = attrs.items;

  this.sortedByVk = this.items.toList().sortBy(function(track) {
    return track.index;
  });

  this.cache = {};
}

Tracks.prototype.toJSON = function() {
  return omit(this, ['cache', 'sortedByVk']);
};

Tracks.prototype.diff = function(otherTracks) {
  return [];
};

Tracks.prototype.merge = function(otherTracks) {
  return new Tracks({
    items: this.items.union(otherTracks.items)
  });
};

Tracks.prototype.applyDiff = function(txData) {
  return this;
};

Tracks.prototype.fromVkResponse = function(res) {
  var tracks = res.items.map(function(vkData, i) {
    return new Track(merge(vkData, { index: res.offset + i }));
  });

  return new Tracks({
    items: new ISet(tracks)
  });
};

Tracks.prototype.size = function () {
  return this.items.size;
};

Tracks.prototype.first = function () {
  return this.sortedByVk.first();
};

Tracks.prototype.getAll = function () {
  return this.sortedByVk;
};

Tracks.prototype.findByArtist = function (artist) {
  return this.query('findByArtist:' + artist, function () {
    return this.getAll().filter(function (track) {
      return track.artist === artist;
    });
  });
};

Tracks.prototype.playlistForArtist = function(artist) {
  return new ArtistTracklist({
    artist: artist,
    playlist: new Playlist({
      tracks: this.findByArtist(artist)
    })
  });
};

Tracks.prototype.modify = function (attrs) {
  return new Tracks(merge(this, attrs));
};

Tracks.prototype.updatePlayer = function(player) {
  if (player.tracklist.type === 'library') {
    return player.useTracklist(player.tracklist.update(this));
  }

  if (player.tracklist.type === 'artist') {
    return player.useTracklist(player.tracklist.update(this));
  }
};

Tracks.prototype.query = function (key, fn) {
  console.time('query[' + key + ']');

  if (!this.cache[key]) {
    this.cache[key] = fn.call(this);
  }

  console.timeEnd('query[' + key + ']');
  return this.cache[key];
};

module.exports = new Tracks({
  items: new ISet()
});
