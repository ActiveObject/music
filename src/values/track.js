var merge = require('app/fn/merge');

function Track(attrs) {
  if (!(this instanceof Track)) {
    return new Track(attrs);
  }

  this.id = Number(attrs.id);
  this.owner = attrs.owner_id;
  this.album = attrs.album;
  this.audio = attrs.audio;
}

Track.fromVk = function (data) {
  return new Track({
    id: Number(data.id),
    owner: data.owner_id,
    album: data.album_id,
    audio: {
      artist: data.artist,
      title: data.title,
      duration: data.duration,
      index: data.index,
      url: data.url
    }
  });
};

Track.fromJSON = function (data) {
  return new Track({
    id: data.id,
    owner: data.owner,
    album: data.album,
    audio: data.audio
  });
};

Track.prototype.toJSON = function () {
  return {
    'app/values/track': {
      id: this.id,
      owner: this.owner,
      album: this.album,
      audio: this.audio
    }
  };
};

Track.prototype.tag = function () {
  return 'track';
};

Track.prototype.rep = function () {
  return {
    id: this.id,
    owner: this.owner,
    audio: this.audio
  };
};

Track.prototype.toString = function() {
  return 'Track #' + this.id;
};

Track.prototype.hashCode = function() {
  return this.id;
};

Track.prototype.equals = function(other) {
  return this.id === other.id;
};

Track.prototype.modify = function (attrs) {
  return new Track(merge(this, attrs));
};

module.exports = Track;
