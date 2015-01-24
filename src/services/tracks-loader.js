var vk = require('app/vk');
var Atom = require('app/core/atom');
var Track = require('app/values/track');
var merge = require('app/utils/merge');

function TracksLoader(user) {
  this.user = user;

  this.inbox = [{
    user: user,
    offset: 0,
    count: 1000
  }];

  this.atom = new Atom();
}

TracksLoader.prototype.process = function () {
  if (this.inbox.length === 0) {
    return;
  }

  var req = this.inbox[0];

  this.load(req, function (err, data) {
    this.inbox.shift();

    if (err) {
      return console.log(err);
    }

    Atom.swap(this, data.items.map(function (data, i) {
      return Track.fromVk(merge(data, { index: req.offset + i }));
    }));

    if (data.count > 0 && data.count > req.offset + req.count) {
      this.inbox.push({
        user: req.user,
        offset: req.offset + req.count,
        count: req.count
      });

      this.process();
    }
  }.bind(this));
};

TracksLoader.prototype.load = function (req, callback) {
  vk.audio.get({
    user_id: req.user.id,
    offset: req.offset,
    count: req.count
  }, function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, res.response);
  });
};

module.exports = TracksLoader;
