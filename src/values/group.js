var merge = require('app/fn/merge');
var attrEquals = require('app/fn/attrEquals');

function Group(attrs) {
  if (!(this instanceof Group)) {
    return new Group(attrs);
  }

  this.id = attrs.id;
  this.isAdmin = attrs.isAdmin;
  this.isClosed = attrs.isClosed;
  this.isMember = attrs.isMember;
  this.name = attrs.name;
  this.photo_50 = attrs.photo_50;
  this.photo_100 = attrs.photo_100;
  this.photo_200 = attrs.photo_200;
  this.screenName = attrs.screenName;
  this.type = attrs.type;
}

Group.fromVk = function (data) {
  return new Group({
    id: data.id,
    isAdmin: data.is_admin,
    isClosed: data.is_closed,
    isMember: data.is_member,
    name: data.name,
    photo_50: data.photo_50,
    photo_100: data.photo_100,
    photo_200: data.photo_200,
    screenName: data.screen_name,
    type: data.type
  });
};

Group.fromJSON = function (v) {
  return new Group(v);
};

Group.prototype.toJSON = function () {
  return {
    'app/values/group': {
      id: this.id,
      isAdmin: this.isAdmin,
      isClosed: this.isClosed,
      isMember: this.isMember,
      name: this.name,
      photo_50: this.photo_50,
      photo_100: this.photo_100,
      photo_200: this.photo_200,
      screenName: this.screenName,
      type: this.type
    }
  };
};

Group.prototype.tag = function () {
  return 'group';
};

Group.prototype.rep = function () {
  return this.toJSON()['app/values/group'];
};

Group.prototype.toString = function() {
  return 'Group (' + this.name + ')';
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

module.exports = Group;
