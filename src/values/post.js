var merge = require('app/utils').merge;

function Post(attrs) {
  this.id = attrs.id;
}

Post.prototype.modify = function(attrs) {
  return new Post(merge(this, attrs));
};

module.exports = new Post({});
