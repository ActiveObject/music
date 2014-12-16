var uuid = require('uuid');
var merge = require('app/utils').merge;

function PostTracklist(attrs) {
  this.id = uuid.v4();
  this.type = 'post';
  this.post = attrs.post;
  this.playlist = attrs.playlist;
}

PostTracklist.prototype.update = function (library) {
  return this;
};

PostTracklist.prototype.recentTag = function () {
  return this.type + ':' + this.post;
};

PostTracklist.prototype.modify = function (attrs) {
  return new PostTracklist(merge(this, attrs));
};

module.exports = PostTracklist;
