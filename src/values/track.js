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
  this.index = attrs.index;

  this.lyrics_id = attrs.lyrics_id;
  this.owner_id = attrs.owner_id;
  this.url = attrs.url;
}

Track.fromDatoms = function (datoms) {
  if (datoms.size === 0) {
    return Track({ });
  }

  var attrs = _.object(datoms.map(function (datom) { return [datom[1], datom[2]]; }).toArray());

  return new Track({
    id: attrs[':track/vkid'],
    artist: attrs[':track/artist'],
    title: attrs[':track/title'],
    duration: attrs[':track/duration'],
    owner_id: attrs[':track/owner_id'],
    url: attrs[':track/url'],
    index: attrs[':track/vk-index']
  });
};

Track.prototype.modify = function (attrs) {
  return new Track(_.extend({}, this, attrs));
};

Track.prototype.play = function () {
  return ActiveTrack.empty.modify({
    track: this,
    isPlaying: true
  });
};

Track.prototype.toDatoms = function () {
  var id = 'tracks/' + this.id;

  return [
    [id, ':track/title', this.title],
    [id, ':track/artist', this.artist],
    [id, ':track/duration', this.duration],
    [id, ':track/owner_id', this.owner_id],
    [id, ':track/url', this.url],
    [id, ':track/vkid', this.id],
    [id, ':track/vk-index', this.index]
  ];
};

module.exports = Track;