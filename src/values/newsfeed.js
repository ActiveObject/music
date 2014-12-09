var List = require('immutable').List;
var merge = require('app/utils').merge;
var post = require('app/values/post');

function Newsfeed(attrs) {
  this.posts = attrs.posts;
  this.total = attrs.total;
}

Newsfeed.prototype.modify = function(attrs) {
  return new Newsfeed(merge(this, attrs));
};

Newsfeed.prototype.fromVkResponse = function(res) {
  return this.modify({
    total: res.count,
    posts: new List(res.items.map(function(attrs) {
      return post.modify(attrs);
    }))
  });
};

module.exports = new Newsfeed({
  posts: new List(),
  total: 0
});
