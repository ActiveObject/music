var _ = require('underscore');

function EmptyTrack() {
  if (!(this instanceof EmptyTrack)) {
    return new EmptyTrack();
  }
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

VkTrack.togglePlay = function (track) {
  return VkTrack.modify(track, { isPlaying: !track.isPlaying });
};

module.exports = VkTrack;