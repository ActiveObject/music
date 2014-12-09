var BasePlaylist = require('app/values/playlist/base');
var merge = require('app/utils').merge;

function PostPlaylist(attrs) {
  BasePlaylist.call(this, attrs);

  this.type = 'post';
  this.post = attrs.post;
  this.tracks = attrs.tracks;
}

PostPlaylist.prototype = Object.create(BasePlaylist.prototype, {
  constructor: { value: PostPlaylist, enumerable: false }
});

PostPlaylist.prototype.update = function (library) {
  return this;
};

PostPlaylist.prototype.recentTag = function () {
  return this.type + ':' + this.post;
};

PostPlaylist.prototype.modify = function (attrs) {
  return new PostPlaylist(merge(this, attrs));
};

module.exports = PostPlaylist;
