var _ = require('underscore');

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

function VkTrack(data) {
  if (!(this instanceof VkTrack)) {
    return new VkTrack(data);
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

VkTrack.Empty = EmptyTrack;

VkTrack.isEmpty = function (x) {
  return x instanceof EmptyTrack;
};

VkTrack.modify = function (track, opts) {
  return new VkTrack(_.extend({}, track, opts));
};

VkTrack.play = function (track) {
  return VkTrack.modify(track, { isPlaying: true });
};

VkTrack.pause = function (track) {
  return VkTrack.modify(track, { isPlaying: false });
};

VkTrack.togglePlay = function (track) {
  return VkTrack.modify(track, { isPlaying: !track.isPlaying });
};

VkTrack.relativePosition = function (track) {
  if (track.duration === 0) {
    return 0;
  }

  return track.position / track.duration / 1000;
};

VkTrack.updatePosition = function (track, value) {
  return VkTrack.modify(track, {
    position: value
  });
};

VkTrack.startSeeking = function (track) {
  return VkTrack.modify(track, {
    seeking: true
  });
};

VkTrack.stopSeeking = function (track) {
  return VkTrack.modify(track, {
    seeking: false
  });
};

VkTrack.updateLoaded = function (track, options) {
  return VkTrack.modify(track, {
    bytesLoaded: options.bytesLoaded,
    bytesTotal: options.bytesTotal
  });
};

VkTrack.relativeLoaded = function (track) {
  if (track.bytesTotal === 0) {
    return 0;
  }

  return track.bytesLoaded / track.bytesTotal;
};

module.exports = VkTrack;