var Immutable = require('immutable');
var vk = require('app/vk');
var Album = require('app/values/album');

function AlbumsLoader(user) {
  this.user = user;
}

AlbumsLoader.prototype.go = function (input, output) {
  input.onValue(function (msg) {
    vk.audio.getAlbums({
      user_id: msg.user.id,
      offset: msg.offset,
      count: msg.count
    }, function(err, res) {
      if (err) {
        return output.error(err);
      }

      output.push(Immutable.Set(res.response.items.map(Album.fromVk)));

      if (res.response.count > 0 && res.response.count > msg.offset + msg.count) {
        input.push({
          user: msg.user,
          offset: msg.offset + msg.count,
          count: msg.count
        });
      } else {
        output.end();
      }
    });
  });

  input.push({
    user: this.user,
    offset: 0,
    count: 100
  });
};

AlbumsLoader.prototype.toString = function () {
  return 'AlbumsLoader(' + this.user.toString() + ')';
};

module.exports = AlbumsLoader;
