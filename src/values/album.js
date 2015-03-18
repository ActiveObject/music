function Album(attrs) {
  if (!(this instanceof Album)) {
    return new Album(attrs);
  }

  this.id = attrs.id,
  this.owner = attrs.owner;
  this.title = attrs.title;
}

Album.fromVk = function (attrs) {
  return new Album({
    id: attrs.id,
    owner: attrs.owner_id,
    title: attrs.title
  });
};

Album.prototype.valueOf = function () {
  return this.id;
};

Album.prototype.tag = function () {
  return ':app/album';
};

Album.prototype.rep = function () {
  return {
    id: this.id,
    owner: this.owner,
    title: this.title
  };
};

module.exports = Album;