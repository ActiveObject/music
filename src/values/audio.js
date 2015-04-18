var hashCode = require('app/fn/hashCode');
var attrEquals = require('app/fn/attrEquals');

function Audio(attrs) {
  if (!(this instanceof Audio)) {
    return new Audio(attrs);
  }

  this.artist = attrs.artist;
  this.title = attrs.title;
  this.duration = attrs.duration;
  this.index = attrs.index;
  this.url = attrs.url;
}

Audio.prototype.toJSON = function() {
  return {
    artist: this.artist,
    title: this.title,
    duration: this.duration,
    index: this.index,
    url: this.url
  };
};

Audio.prototype.tag = function () {
  return 'audio';
};

Audio.prototype.rep = function () {
  return this.toJSON();
};

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

module.exports = Audio;