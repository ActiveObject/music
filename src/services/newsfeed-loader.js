var Atom = require('app/core/atom');
var vk = require('app/vk');
var merge = require('app/utils/merge');
var newsfeed = require('app/values/newsfeed');

function loadWall(owner, offset, count, callback) {
  vk.wall.get({
    owner_id: owner,
    offset: offset,
    count: count < 100 ? count : 100
  }, function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, merge(res.response, {
      offset: offset
    }));

    if (count - 100 > 0) {
      return loadWall(owner, offset + 100, count - 100, callback);
    }
  });
}


function NewsfeedLoader(owner) {
  this.atom = new Atom(newsfeed);
  this.owner = owner;
}

NewsfeedLoader.prototype.load = function (offset, count) {
  var that = this;

  loadWall(this.owner, offset, count, function (err, data) {
    if (err) {
      return console.log(data);
    }

    Atom.update(that, v => v.merge(newsfeed.fromVkResponse(data)));
  });
};

NewsfeedLoader.prototype.release = function () {
  Atom.off(this);
};

module.exports = NewsfeedLoader;