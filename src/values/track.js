var _ = require('underscore');
var ActiveTrack = require('app/values/active-track');

function Track(attrs) {
  if (!(this instanceof Track)) {
    return new Track(attrs);
  }

  this.id = attrs.id;
  this.artist = attrs.artist;
  this.title = attrs.title;
  this.duration = attrs.duration;

  this.lyrics_id = attrs.lyrics_id;
  this.owner_id = attrs.owner_id;
  this.url = attrs.url;
}

Track.prototype.modify = function (attrs) {
  return new Track(_.extend({}, this, attrs));
};

Track.prototype.play = function () {
  return ActiveTrack.empty.modify({
    track: this,
    isPlaying: true
  });
};

module.exports = Track;