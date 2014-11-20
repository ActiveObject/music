var _ = require('underscore');
var Playlist = require('app/values/playlist');

function Player(attrs) {
  if (!(this instanceof Player)) {
    return new Player(attrs);
  }


  this.track = attrs.track;
  this.playlist = attrs.playlist;
  this.isPlaying = attrs.isPlaying;
  this.position = attrs.position;
  this.seeking = attrs.seeking;
  this.bytesLoaded = attrs.bytesLoaded;
  this.bytesTotal = attrs.bytesTotal;

  if (Object.keys(this.track).length === 0 && this.playlist.tracks.size() > 0) {
    this.track = this.playlist.tracks.first();
  }
}

Player.empty = new Player({
  track: {},
  playlist: Playlist.empty,
  isPlaying: false,
  position: 0,
  seeking: false,
  bytesTotal: 0,
  bytesLoaded: 0
});

Player.prototype.modify = function (attrs) {
  return new Player(_.extend({}, this, attrs));
};

Player.prototype.play = function() {
  return this.modify({ isPlaying: true });
};

Player.prototype.pause = function () {
  return this.modify({ isPlaying: false });
};

Player.prototype.togglePlay = function (track) {
  if (track.id !== this.track.id) {
    return this.modify({
      track: track,
      isPlaying: true
    });
  }

  return this.modify({ isPlaying: !this.isPlaying });
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

Player.prototype.setPlaylist = function(tracks) {
  return this.modify({
    playlist: this.playlist.setSource(tracks)
  });
};

module.exports = Player;
