var _ = require('underscore');
var getOrDefault = require('app/utils').getOrDefault;
var Activity = require('app/values/activity');

function Post(options) {
  if (!(this instanceof Post)) {
    return new Post(options);
  }

  this.id = options.id;
  this.from = options.from_id;
  this.owner = options.owner_id;
  this.date = new Date(options.date * 1000);
  this.likes = options.likes;
}

function Group(data) {
  if (!(this instanceof Group)) {
    return new Group(data);
  }

  this.id = data.id;
  this.isAdmin = data.is_admin === 1;
  this.isClosed = data.is_closed === 1;
  this.isMember = data.is_member === 1;
  this.name = data.name;
  this.photo_50 = data.photo_50;
  this.photo_100 = data.photo_100;
  this.photo_200 = data.photo_200;
  this.screenName = data.screen_name;
  this.type = data.type;

  this.postsTotal = getOrDefault(data, 'postsTotal', 0);
  this.posts = getOrDefault(data, 'posts', []);

  this.activity = getOrDefault(data, 'activity', Activity.empty);
}

Group.prototype.isEmpty = function () {
  return false;
};

Group.prototype.modify = function (attrs) {
  return new Group(_.extend({}, this, attrs));
};

Group.prototype.updateWall = function (wall) {
  var posts = wall.items.map(Post);

  return this.modify({
    postsTotal: wall.count,
    posts: posts,
    activity: Activity.update({
      total: wall.count,
      items: posts,
    }, this.activity)
  });
};

function EmptyGroup() {
  if (!(this instanceof EmptyGroup)) {
    return new EmptyGroup();
  }

  this.postsTotal = 0;
  this.posts = [];

  this.activity = Activity.empty;
}

EmptyGroup.prototype = Object.create(Group.prototype, {
  constructor: { value: EmptyGroup, enumerable: false }
});

EmptyGroup.prototype.isEmpty = function () {
  return true;
};

module.exports = Group;
module.exports.Empty = EmptyGroup;