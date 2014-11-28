var _ = require('underscore');
var merge = require('app/utils').merge;
var LibraryPlaylist = require('app/values/playlist/library');
var Tracks = require('app/values/tracks');

function Player(attrs) {
  if (!(this instanceof Player)) {
    return new Player(attrs);
  }

  var isPlaylistChanged = attrs.playlist !== this.playlist;

  this.track = attrs.track;
  this.playlist = attrs.playlist;
  this.isPlaying = attrs.isPlaying;
  this.position = attrs.position;
  this.seeking = attrs.seeking;
  this.bytesLoaded = attrs.bytesLoaded;
  this.bytesTotal = attrs.bytesTotal;
  this.recentPlaylists = this.makeRecent(attrs.recentPlaylists, attrs.playlist, isPlaylistChanged);

  if (Object.keys(this.track).length === 0 && this.playlist.tracks.size > 0) {
    this.track = this.playlist.tracks.first();
  }
}

Player.prototype.modify = function (attrs) {
  return new Player(merge(this, attrs));
};

Player.prototype.play = function() {
  return this.modify({ isPlaying: true });
};

Player.prototype.pause = function () {
  return this.modify({ isPlaying: false });
};

Player.prototype.togglePlay = function (track, playlist) {
  if (track.id !== this.track.id) {
    return this.modify({
      track: track,
      playlist: playlist,
      isPlaying: true
    });
  }

  return this.modify({
    playlist: playlist,
    isPlaying: !this.isPlaying
  });
};

Player.prototype.relativePosition = function () {
  if (this.track.duration === 0) {
    return 0;
  }

  return this.position / this.track.duration / 1000;
};

Player.prototype.updatePosition = function (value) {
  return this.modify({ position: value });
};

Player.prototype.seek = function(position) {
  return this.updatePosition(this.track.duration * position * 1000);
};

Player.prototype.startSeeking = function () {
  return this.modify({ seeking: true });
};

Player.prototype.stopSeeking = function () {
  return this.modify({ seeking: false });
};

Player.prototype.updateLoaded = function (options) {
  return this.modify({
    bytesLoaded: options.bytesLoaded,
    bytesTotal: options.bytesTotal
  });
};

Player.prototype.relativeLoaded = function () {
  if (this.bytesTotal === 0) {
    return 0;
  }

  return this.bytesLoaded / this.bytesTotal;
};

Player.prototype.next = function() {
  if (!this.playlist.isLastTrack(this.track)) {
    return this.modify({
      track: this.playlist.nextAfter(this.track)
    });
  }

  return this;
};

Player.prototype.changePlaylist = function(newPlaylist) {
  return this.modify({
    playlist: newPlaylist
  });
};

Player.prototype.updatePlaylist = function (library) {
  return this.modify({
    playlist: this.playlist.update(library)
  });
};

Player.prototype.visiblePlaylist = function() {
  var recentItem = _.findWhere(this.recentPlaylists, { visible: true });

  if (!recentItem) {
    return this.playlist;
  }

  return recentItem.playlist;
};

Player.prototype.makeRecent = function(prevRecent, prevPlaylist, isPlaylistChanged) {
  if (prevRecent.length === 0) {
    return prevRecent.concat({
      visible: true,
      type: this.playlist.recentTag(),
      playlist: this.playlist
    });
  }

  if (isPlaylistChanged && _.contains(_.pluck(prevRecent, 'type'), prevPlaylist.recentTag())) {
    var recentItem = _.find(prevRecent, function(item) {
      return item.playlist.recentTag() === prevPlaylist.recentTag();
    });

    var recentItems = this.recentPlaylists = prevRecent.filter(function(item) {
      return item.playlist.recentTag() !== prevPlaylist.recentTag();
    });

    return recentItems.concat({
      visible: recentItem.visible,
      type: prevPlaylist.recentTag(),
      playlist: prevPlaylist
    });
  }

  return prevRecent.concat({
    visible: false,
    type: prevPlaylist.recentTag(),
    playlist: prevPlaylist
  });
};

Player.prototype.switchPlaylist = function (id) {
  return this.modify({
    recentPlaylists: this.recentPlaylists.map(function (item) {
      return _.extend(item, {
        visible: item.playlist.id === id
      });
    })
  });
};

Player.empty = new Player({
  track: {},
  playlist: new LibraryPlaylist({
    library: Tracks.empty,
    isShuffled: false,
    isRepeated: false
  }),
  isPlaying: false,
  position: 0,
  seeking: false,
  bytesTotal: 0,
  bytesLoaded: 0,
  recentPlaylists: []
});


module.exports = Player;
