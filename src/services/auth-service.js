var vbus = require('app/core/vbus');
var Auth = require('app/core/auth');
var router = require('app/core/router');
var AuthRoute = require('app/routes/auth-route');
var accounts = require('app/accounts');
var tagOf = require('app/utils/tagOf');

if (Auth.hasToken(location.hash)) {
  Auth.storeToLs(location.hash);
  location.hash = '';
}

vbus
  .filter(v => tagOf(v) === ':app/unauthenticated-user')
  .onValue(user => router.transitionTo(new AuthRoute({ vkAccount: accounts.vk })));

vbus.push(Auth.readFromLs());
