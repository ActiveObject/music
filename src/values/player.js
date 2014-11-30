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
  this.bytesLoaded = attrs.bytesLoaded;
  this.bytesTotal = attrs.bytesTotal;
  this.seeking = attrs.seeking;
  this.seekPosition = attrs.seekPosition;

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
  if (arguments.length === 0) {
    return {
      e: 'app/player',
      a: ':player/is-playing',
      v: !this.isPlaying
    };
  }

  var datoms = [];

  if (track.id !== this.track.id) {
    datoms.push({ e: 'app/player', a: ':player/track', v: track });
    datoms.push({ e: 'app/player', a: ':player/is-playing', v: true });
  }

  if (track.id === this.track.id) {
    datoms.push({ e: 'app/player', a: ':player/is-playing', v: !this.isPlaying });
  }

  if (playlist.id !== this.playlist.id) {
    datoms.push({ e: 'app/player', a: ':player/playlist', v: playlist });
  }

  return datoms;
};

Player.prototype.relativePosition = function () {
  if (this.track.duration === 0) {
    return 0;
  }

  return this.position / this.track.duration / 1000;
};

Player.prototype.relativeSeekPosition = function () {
  if (this.track.duration === 0) {
    return 0;
  }

  return this.seekPosition / this.track.duration / 1000;
};

Player.prototype.seek = function (position) {
  return {
    e: 'app/player',
    a: ':player/seek-position',
    v: this.track.duration * position * 1000
  };
};

Player.prototype.seekTo = function (position) {
  return {
    e: 'app/player',
    a: ':player/position',
    v: this.track.duration * position * 1000
  };
};

Player.prototype.startSeeking = function (v) {
  return [
    { e: 'app/player', a: ':player/seek-position', v: this.position },
    { e: 'app/player', a: ':player/seeking', v: true }
  ];
};

Player.prototype.stopSeeking = function () {
  return [
    { e: 'app/player', a: ':player/position', v: this.seekPosition },
    { e: 'app/player', a: ':player/seeking', v: false }
  ];
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
  var recent = this.recentPlaylists.map(function (item) {
    return _.extend(item, {
      visible: item.playlist.id === id
    });
  });

  return {
    e: 'app/player',
    a: ':player/recent-playlists',
    v: recent
  };
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
  seekPosition: 0,
  seeking: false,
  bytesTotal: 0,
  bytesLoaded: 0,
  recentPlaylists: []
});


module.exports = Player;
