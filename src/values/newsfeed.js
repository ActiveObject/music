var List = require('immutable').List;
var merge = require('app/utils/merge');
var post = require('app/values/post');

function Newsfeed(attrs) {
  this.owner = attrs.owner;
  this.posts = attrs.posts;
  this.total = attrs.total;
}

Newsfeed.prototype.modify = function(attrs) {
  return new Newsfeed(merge(this, attrs));
};

Newsfeed.prototype.fromVkResponse = function(res) {
  return this.modify({
    owner: res.owner,
    total: res.count,
    posts: new List(res.items.map(function(attrs) {
      return post.modify(attrs);
    }))
  });
};

Newsfeed.prototype.merge = function(otherNf) {
  return new Newsfeed({
    posts: this.posts.toSet().union(otherNf.posts.toSet()).toList(),
    total: Math.max(this.total, otherNf.total)
  });
};

module.exports = new Newsfeed({
  posts: new List(),
  total: 0,
  owner: 0
});
