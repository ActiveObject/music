var _ = require('underscore');

function Track(data) {
  if (!(this instanceof Track)) {
    return new Track(data);
  }

  this.id = data.id;
  this.artist = data.artist;
  this.title = data.title;
  this.duration = data.duration;

  this.lyrics_id = data.lyrics_id;
  this.owner_id = data.owner_id;
  this.url = data.url;

  this.isPlaying = _.has(data, 'isPlaying') ? data.isPlaying : false;
  this.position = _.has(data, 'position') ? data.position : 0;
  this.seeking = _.has(data, 'seeking') ? data.seeking : false;
  this.bytesLoaded = _.has(data, 'bytesLoaded') ? data.bytesLoaded : 0;
  this.bytesTotal = _.has(data, 'bytesTotal') ? data.bytesTotal : 0;
}

Track.prototype.isEmpty = function (x) {
  return false;
};

Track.prototype.modify = function (opts) {
  return new Track(_.extend({}, this, opts));
};

Track.prototype.play = function () {
  return this.modify({ isPlaying: true });
};

Track.prototype.pause = function () {
  return this.modify({ isPlaying: false });
};

Track.prototype.togglePlay = function () {
  return this.modify({ isPlaying: !this.isPlaying });
};

Track.prototype.relativePosition = function () {
  if (this.duration === 0) {
    return 0;
  }

  return this.position / this.duration / 1000;
};

Track.prototype.updatePosition = function (value) {
  return this.modify({ position: value });
};

Track.prototype.startSeeking = function () {
  return this.modify({
    seeking: true
  });
};

Track.prototype.stopSeeking = function () {
  return this.modify({ seeking: false });
};

Track.prototype.updateLoaded = function (options) {
  return this.modify({
    bytesLoaded: options.bytesLoaded,
    bytesTotal: options.bytesTotal
  });
};

Track.prototype.relativeLoaded = function () {
  if (this.bytesTotal === 0) {
    return 0;
  }

  return this.bytesLoaded / this.bytesTotal;
};


function EmptyTrack() {
  if (!(this instanceof EmptyTrack)) {
    return new EmptyTrack();
  }

  this.isPlaying = false;
  this.position = 0;
  this.duration = 0;
  this.seeking = false;
  this.bytesLoaded = 0;
  this.bytesTotal = 0;
}

EmptyTrack.prototype = Object.create(Track.prototype, {
  constructor: { value: EmptyTrack }
});

EmptyTrack.prototype.isEmpty = function () {
  return true;
};

module.exports = Track;
module.exports.Empty = EmptyTrack;
module.exports.isEmpty = function (x) {
  return x.isEmpty();
};