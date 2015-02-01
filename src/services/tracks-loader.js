var Immutable = require('immutable');
var vk = require('app/vk');
var Track = require('app/values/track');
var merge = require('app/utils/merge');

function TracksLoader(user) {
  this.user = user;
}

TracksLoader.prototype.go = function (input, output, errout) {
  input.onValue(function (msg) {
    vk.audio.get({
      user_id: msg.user.id,
      offset: msg.offset,
      count: msg.count
    }, function(err, res) {
      if (err) {
        return errout.push(err);
      }

      output.push(Immutable.Set(res.response.items.map(function (data, i) {
        return Track.fromVk(merge(data, { index: msg.offset + i }));
      })));

      if (res.response.count > 0 && res.response.count > msg.offset + msg.count) {
        input.push({
          user: msg.user,
          offset: msg.offset + msg.count,
          count: msg.count
        });
      } else {
        input.end();
      }
    });
  });

  input.push({
    user: this.user,
    offset: 0,
    count: 1000
  });
};

TracksLoader.prototype.toString = function () {
  return 'TracksLoader(' + this.user.toString() + ')';
};

module.exports = TracksLoader;
