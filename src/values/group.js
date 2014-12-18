var _ = require('underscore');
var merge = require('app/utils').merge;
var attrEquals = require('app/utils').attrEquals;
var newsfeed = require('app/values/newsfeed');

function Group(attrs) {
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

  this.wall = attrs.wall.modify({ owner: -this.id });
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
  return this.modify({
    wall: this.wall.merge(wall)
  });
};

module.exports = new Group({
  id: -1,
  wall: newsfeed
});
