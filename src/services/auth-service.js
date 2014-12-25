var Auth = require('app/core/auth');
var accounts = require('app/accounts');
var layout = require('app/layout');

module.exports = function (receive, send) {
  if (Auth.hasToken(location.hash)) {
    Auth.storeToLs(location.hash);
    location.hash = '';
  }

  receive(':app/started', function() {
    send({ e: 'app', a: ':app/user', v: Auth.readFromLs() });
  });

  receive(':app/user', function(appstate, user) {
    if (!user.isAuthenticated()) {
      layout.auth(accounts.vk);
    }

    return appstate.set('user', user);
  });
};
