var vk = require('app/vk');
var Atom = require('app/core/atom');
var Group = require('app/values/group');

function GroupsLoader(user) {
  this.user = user;

  this.inbox = [{
    user: user,
    offset: 0,
    count: 100
  }];

  this.atom = new Atom();
}

GroupsLoader.prototype.process = function () {
  if (this.inbox.length === 0) {
    return;
  }

  var req = this.inbox[0];

  this.load(req, function (err, data) {
    this.inbox.shift();

    if (err) {
      return console.log(err);
    }

    Atom.swap(this, data.items.map(Group.fromVk));

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

GroupsLoader.prototype.load = function (req, callback) {
  vk.groups.get({
    user_id: req.user.id,
    offset: req.offset,
    count: req.count,
    extended: 1
  }, function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, res.response);
  });
};

module.exports = GroupsLoader;
