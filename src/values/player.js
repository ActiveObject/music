var _ = require('underscore');
var List = require('immutable').List;
var merge = require('app/fn/merge');
var LibraryTracklist = require('app/values/tracklists/library-tracklist');
var Playlist = require('app/values/playlist');
var Track = require('app/values/track');

function Player(attrs) {
  if (!(this instanceof Player)) {
    return new Player(attrs);
  }

  var isTracklistChanged = attrs.tracklist !== this.tracklist;

  this.track = attrs.track;
  this.tracklist = attrs.tracklist;
  this.isPlaying = attrs.isPlaying;
  this.position = attrs.position;
  this.bytesLoaded = attrs.bytesLoaded;
  this.bytesTotal = attrs.bytesTotal;
  this.seeking = attrs.seeking;
  this.seekPosition = attrs.seekPosition;

  this.recentTracklists = this.makeRecent(attrs.recentTracklists, attrs.tracklist, isTracklistChanged);
}

Player.prototype.toJSON = function () {
  return {
    'app/values/player': {
      track: this.track.toJSON(),
      isPlaying: this.isPlaying,
      position: this.position,
      bytesLoaded: this.bytesLoaded,
      bytesTotal: this.bytesTotal,
      seeking: this.seeking,
      seekPosition: this.seekPosition,
      recentTracklists: []
    }
  };
};

Player.prototype.fromJSON = function (v) {
  return new Player(merge(v, {
    track: v.track[Object.keys(v.track)[0]],
    tracklist: new LibraryTracklist({
      playlist: new Playlist({
        tracks: List(),
        isShuffled: false,
        isRepeated: false
      })
    })
  }));
};

Player.prototype.fromTransit = function (v) {
  return new Player(merge(v, {
    track: v.track,
    tracklist: new LibraryTracklist({
      playlist: new Playlist({
        tracks: List(),
        isShuffled: false,
        isRepeated: false
      })
    })
  }));
};

Player.prototype.tag = function() {
  return ':app/player';
};

Player.prototype.rep = function() {
  return {
    track: this.track,
    isPlaying: this.isPlaying,
    position: this.position,
    bytesLoaded: this.bytesLoaded,
    bytesTotal: this.bytesTotal,
    seeking: this.seeking,
    seekPosition: this.seekPosition,
    recentTracklists: []
  };
};

Player.prototype.modify = function (attrs) {
  return new Player(merge(this, attrs));
};

Player.prototype.play = function() {
  return this.modify({ isPlaying: true });
};

Player.prototype.pause = function () {
  return this.modify({ isPlaying: false });
};

Player.prototype.stop = function () {
  return this.pause().seek(0);
};

Player.prototype.togglePlay = function (track, tracklist) {
  if (arguments.length === 0) {
    return this.togglePlayState();
  }

  var player = this;

  if (track.id !== this.track.id) {
    player = player.useTrack(track).play();
  }

  if (track.id === this.track.id) {
    player = player.togglePlayState();
  }

  if (tracklist !== this.tracklist) {
    player = player.useTracklist(tracklist);
  }

  return player;
};

Player.prototype.togglePlayState = function () {
  return this.modify({ isPlaying: !this.isPlaying });
};

Player.prototype.seek = function (position) {
  return this.modify({
    seekPosition: this.track.audio.duration * position * 1000
  });
};

Player.prototype.seekTo = function (position) {
  return this.modify({
    position: this.track.audio.duration * position * 1000
  });
};

Player.prototype.startSeeking = function (v) {
  return this.modify({
    seekPosition: this.position,
    seeking: true
  });
};

Player.prototype.stopSeeking = function () {
  return this.modify({
    position: this.seekPosition,
    seeking: false
  });
};

Player.prototype.nextTrack = function() {
  if (this.tracklist.playlist.isLastTrack(this.track)) {
    return this.stop();
  }

  return this.useTrack(this.tracklist.playlist.nextAfter(this.track));
};

Player.prototype.switchToPlaylist = function (id) {
  return this.setVisibleTracklist(id);
};

Player.prototype.useTrack = function (track) {
  return this.modify({ track: track });
};

Player.prototype.useTracklist = function(tracklist) {
  if (Object.keys(this.track).length === 0 && tracklist.playlist.tracks.size > 0) {
    return this.useTrack(tracklist.playlist.tracks.first());
  }

  return this.modify({ tracklist: tracklist });
};

Player.prototype.relativePosition = function () {
  if (this.track.audio.duration === 0) {
    return 0;
  }

  return this.position / this.track.audio.duration / 1000;
};

Player.prototype.relativeSeekPosition = function () {
  if (this.track.audio.duration === 0) {
    return 0;
  }

  return this.seekPosition / this.track.audio.duration / 1000;
};

Player.prototype.relativeLoaded = function () {
  if (this.bytesTotal === 0) {
    return 0;
  }

  return this.bytesLoaded / this.bytesTotal;
};

Player.prototype.visibleTracklist = function() {
  var recentItem = _.findWhere(this.recentTracklists, { visible: true });

  if (!recentItem) {
    return this.tracklist;
  }

  return recentItem.tracklist;
};

Player.prototype.setVisibleTrackslit = function (id) {
  var recent = this.recentTracklists.map(function (item) {
    return _.extend(item, {
      visible: item.tracklist.id === id
    });
  });

  return this.modify({
    recentTracklists: recent
  });
};

Player.prototype.makeRecent = function(prevRecent, prevTracklist, isTracklistChanged) {
  if (prevRecent.length === 0) {
    return prevRecent.concat({
      visible: true,
      type: this.tracklist.recentTag(),
      tracklist: this.tracklist
    });
  }

  if (isTracklistChanged && _.contains(_.pluck(prevRecent, 'type'), prevTracklist.recentTag())) {
    var recentItem = _.find(prevRecent, function(item) {
      return item.tracklist.recentTag() === prevTracklist.recentTag();
    });

    var recentItems = this.recentTracklists = prevRecent.filter(function(item) {
      return item.tracklist.recentTag() !== prevTracklist.recentTag();
    });

    return recentItems.concat({
      visible: recentItem.visible,
      type: prevTracklist.recentTag(),
      tracklist: prevTracklist
    });
  }

  return prevRecent.concat({
    visible: false,
    type: prevTracklist.recentTag(),
    tracklist: prevTracklist
  });
};

module.exports = new Player({
  track: {
    audio: {}
  },
  tracklist: new LibraryTracklist({
    playlist: new Playlist({
      tracks: List(),
      isShuffled: false,
      isRepeated: false
    })
  }),
  isPlaying: false,
  position: 0,
  seekPosition: 0,
  seeking: false,
  bytesTotal: 0,
  bytesLoaded: 0,
  recentTracklists: []
});
