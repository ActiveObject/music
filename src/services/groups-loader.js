var Immutable = require('immutable');
var vk = require('app/vk');
var Group = require('app/values/group');

function GroupsLoader(user) {
  this.user = user;
}

GroupsLoader.prototype.go = function (input, output, errout) {
  input.onValue(function (msg) {
    vk.groups.get({
      user_id: msg.user.id,
      offset: msg.offset,
      count: msg.count,
      extended: 1
    }, function(err, res) {
      if (err) {
        return errout.push(err);
      }

      output.push(Immutable.Set(res.response.items.map(Group.fromVk)));

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
    count: 100
  });
};

GroupsLoader.prototype.toString = function () {
  return 'GroupsLoader(' + this.user.toString() + ')';
};

module.exports = GroupsLoader;
