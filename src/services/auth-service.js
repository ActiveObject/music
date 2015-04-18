var Atom = require('app/core/atom');
var AuthRoute = require('app/routes/auth-route');
var vk = require('app/values/accounts/vk');
var user = require('app/db/user');

module.exports = function (vbus) {
  return Atom.listen(user, function (user) {
    if (!user.isAuthenticated()) {
      vbus.emit(new AuthRoute({ vkAccount: vk }));
    }
  });
};

