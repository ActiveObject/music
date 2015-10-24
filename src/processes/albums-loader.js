import vk from 'app/vk';
import * as Album from 'app/Album';

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

      output.emit(res.response.items.map(Album.fromVk));

      if (res.response.count > 0 && res.response.count > msg.offset + msg.count) {
        input.emit({
          user: msg.user,
          offset: msg.offset + msg.count,
          count: msg.count
        });
      } else {
        output.end();
      }
    });
  });

  input.emit({
    user: this.user,
    offset: 0,
    count: 100
  });
};

AlbumsLoader.prototype.toString = function () {
  return 'AlbumsLoader(' + this.user.toString() + ')';
};

export default AlbumsLoader;
