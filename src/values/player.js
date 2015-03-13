var _ = require('underscore');
var List = require('immutable').List;
var merge = require('app/utils/merge');
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
  return 'player';
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
  return { e: 'app/player', a: ':player/is-playing', v: true };
};

Player.prototype.pause = function () {
  return { e: 'app/player', a: ':player/is-playing', v: false };
};

Player.prototype.stop = function () {
  return [this.pause(), this.seek(0)];
};

Player.prototype.togglePlay = function (track, tracklist) {
  if (arguments.length === 0) {
    return this.togglePlayState();
  }

  var datoms = [];

  if (track.id !== this.track.id) {
    datoms.push(this.useTrack(track));
    datoms.push(this.play());
  }

  if (track.id === this.track.id) {
    datoms.push(this.togglePlayState());
  }

  if (tracklist !== this.tracklist) {
    datoms.push(this.useTracklist(tracklist));
  }

  return datoms;
};

Player.prototype.togglePlayState = function () {
  return { e: 'app/player', a: ':player/is-playing', v: !this.isPlaying };
};

Player.prototype.seek = function (position) {
  return {
    e: 'app/player',
    a: ':player/seek-position',
    v: this.track.audio.duration * position * 1000
  };
};

Player.prototype.seekTo = function (position) {
  return {
    e: 'app/player',
    a: ':player/position',
    v: this.track.audio.duration * position * 1000
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

Player.prototype.nextTrack = function() {
  if (this.tracklist.playlist.isLastTrack(this.track)) {
    return this.stop();
  }

  return this.useTrack(this.tracklist.playlist.nextAfter(this.track));
};

Player.prototype.switchToPlaylist = function (id) {
  return { e: 'app/player', a: ':player/visible-tracklist', v: id };
};

Player.prototype.useTrack = function (track) {
  return { e: 'app/player', a: ':player/track', v: track };
};

Player.prototype.useTracklist = function(tracklist) {
  return { e: 'app/player', a: ':player/tracklist', v: tracklist };
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
