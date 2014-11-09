var _ = require('underscore');
var Track = require('app/values/track');

function ActiveTrack(attrs) {
  if (!(this instanceof ActiveTrack)) {
    return new ActiveTrack(attrs);
  }

  _.extend(this, attrs.track);

  this.track = attrs.track;
  this.isPlaying = attrs.isPlaying;
  this.position = attrs.position;
  this.seeking = attrs.seeking;
  this.bytesLoaded = attrs.bytesLoaded;
  this.bytesTotal = attrs.bytesTotal;
}

ActiveTrack.empty = new ActiveTrack({
  track: {},
  isPlaying: false,
  position: 0,
  seeking: false,
  bytesTotal: 0,
  bytesLoaded: 0
});

ActiveTrack.prototype.modify = function (attrs) {
  return new ActiveTrack(_.extend({}, this, attrs));
};

ActiveTrack.prototype.play = function() {
  return this.modify({ isPlaying: true });
};

ActiveTrack.prototype.pause = function () {
  return this.modify({ isPlaying: false });
};

ActiveTrack.prototype.togglePlay = function () {
  return this.modify({ isPlaying: !this.isPlaying });
};

ActiveTrack.prototype.relativePosition = function () {
  if (this.duration === 0) {
    return 0;
  }

  return this.position / this.duration / 1000;
};

ActiveTrack.prototype.updatePosition = function (value) {
  return this.modify({ position: value });
};

ActiveTrack.prototype.startSeeking = function () {
  return this.modify({ seeking: true });
};

ActiveTrack.prototype.stopSeeking = function () {
  return this.modify({ seeking: false });
};

ActiveTrack.prototype.updateLoaded = function (options) {
  return this.modify({
    bytesLoaded: options.bytesLoaded,
    bytesTotal: options.bytesTotal
  });
};

ActiveTrack.prototype.relativeLoaded = function () {
  if (this.bytesTotal === 0) {
    return 0;
  }

  return this.bytesLoaded / this.bytesTotal;
};

module.exports = ActiveTrack;