var vbus = require('app/core/vbus');
var Auth = require('app/core/auth');
var router = require('app/core/router');
var AuthRoute = require('app/routes/auth-route');
var accounts = require('app/accounts');

module.exports = function (receive) {
  if (Auth.hasToken(location.hash)) {
    Auth.storeToLs(location.hash);
    location.hash = '';
  }

  receive(':app/started', function() {
    vbus.push(Auth.readFromLs());
  });

  receive(':app/user', function(appstate, user) {
    if (!user.isAuthenticated()) {
      router.transitionTo(new AuthRoute({ vkAccount: accounts.vk }));
    }

    return appstate.set('user', user);
  });
};
