var vk = require('app/vk');
var merge = require('app/fn/merge');

function TracksLoader(user) {
  this.user = user;
}

TracksLoader.prototype.go = function (input, output) {
  input.onValue(function (msg) {
    vk.audio.get({
      user_id: msg.user.id,
      offset: msg.offset,
      count: msg.count
    }, function(err, res) {
      if (err) {
        return output.error(err);
      }

      output.emit(res.response.items.map(function (data, i) {
        return merge(data, { index: msg.offset + i });
      }));

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
    count: 1000
  });
};

TracksLoader.prototype.toString = function () {
  return 'TracksLoader(' + this.user.toString() + ')';
};

module.exports = TracksLoader;
