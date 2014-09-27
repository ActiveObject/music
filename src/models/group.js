function EmptyGroup() {
  if (!(this instanceof EmptyGroup)) {
    return new EmptyGroup();
  }
}

function VkGroup(data) {
  if (!(this instanceof VkGroup)) {
    return new VkGroup(data);
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
}

VkGroup.isEmpty = function (x) {
  return x instanceof EmptyGroup;
};

VkGroup.Empty = EmptyGroup;

module.exports = VkGroup;