var _ = require('underscore');
var attrEquals = require('app/utils/attrEquals');
var hashCode = require('app/utils/hashCode');
var merge = require('app/utils/merge');

function Audio(attrs) {
  this.artist = attrs.artist;
  this.title = attrs.title;
  this.duration = attrs.duration;
  this.index = attrs.index;
  this.url = attrs.url;
}

Audio.prototype.toString = function () {
  return 'Audio(' + this.artist + ', ' + this.title + ')';
};

Audio.prototype.hashCode = function () {
  return hashCode(this.artist + this.title);
};

Audio.prototype.equals = function (other) {
  return [
    'artist', 'title', 'duration', 'index', 'url'
  ].every(attrEquals(this, other));
};

function Track(attrs) {
  this.id = Number(attrs.id);
  this.owner = attrs.owner_id;
  this.audio = attrs.audio;
}

Track.fromVk = function (data) {
  return new Track({
    id: Number(data.id),
    owner: data.owner_id,
    audio: new Audio({
      artist: data.artist,
      title: data.title,
      duration: data.duration,
      index: data.index,
      url: data.url
    })
  });
};

Track.fromJSON = function (data) {
  return new Track({
    id: data.id,
    owner: data.owner,
    audio: new Audio(data.audio)
  });
};

Track.prototype.toJSON = function () {
  return {
    'app/values/track': {
      id: this.id,
      owner: this.owner,
      audio: this.audio
    }
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
