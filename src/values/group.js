var _ = require('underscore');
var getOrDefault = require('app/utils').getOrDefault;
var merge = require('app/utils').merge;
var attrEquals = require('app/utils').attrEquals;
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

function Group(attrs) {
  if (!(this instanceof Group)) {
    return new Group(attrs);
  }

  this.id = attrs.id;
  this.isAdmin = attrs.is_admin;
  this.isClosed = attrs.is_closed;
  this.isMember = attrs.is_member;
  this.name = attrs.name;
  this.photo_50 = attrs.photo_50;
  this.photo_100 = attrs.photo_100;
  this.photo_200 = attrs.photo_200;
  this.screenName = attrs.screen_name;
  this.type = attrs.type;

  this.postsTotal = getOrDefault(attrs, 'postsTotal', 0);
  this.posts = getOrDefault(attrs, 'posts', []);

  this.activity = getOrDefault(attrs, 'activity', Activity.empty);
}

Group.prototype.toString = function() {
  return 'Group #' + this.id;
};

Group.prototype.hashCode = function() {
  return this.id;
};

Group.prototype.equals = function(other) {
  return [
    'id', 'isAdmin', 'isClosed', 'isMember', 'name',
    'photo_50', 'photo_100', 'photo_200',
    'screenName', 'type'
  ].every(attrEquals(this, other));
};


Group.prototype.modify = function (attrs) {
  return new Group(merge(this, attrs));
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

Group.fromDatoms = function (datoms) {
  if (datoms.size === 0) {
    return Group({ });
  }

  var attrs = _.object(datoms.map(function (datom) { return [datom[1], datom[2]]; }).toArray());

  return new Group({
    type: attrs[':group/type'],
    name: attrs[':group/name'],
    screenName: attrs[':group/screen_name'],
    photo_50: attrs[':group/photo_50'],
    photo_100: attrs[':group/photo_100'],
    photo_200: attrs[':group/photo_200'],
    isClosed: attrs[':group/is_closed'],
    isAdmin: attrs[':group/is_admin'],
    isMember: attrs[':group/is_member'],
    id: attrs[':group/vkid'],
    index: attrs[':group/vk-index']
  });
};


module.exports = Group;
