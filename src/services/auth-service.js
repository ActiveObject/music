var vbus = require('app/core/vbus');
var Auth = require('app/core/auth');
var AuthRoute = require('app/routes/auth-route');
var vk = require('app/values/accounts/vk');
var tagOf = require('app/utils/tagOf');
var onValue = require('app/utils/onValue');

if (Auth.hasToken(location.hash)) {
  Auth.storeToLs(location.hash);
  location.hash = '';
}

module.exports = function (vbus) {
  vbus.emit(Auth.readFromLs());

  return onValue(vbus.filter(v => tagOf(v) === ':app/unauthenticated-user'), function (user) {
    vbus.emit(new AuthRoute({ vkAccount: vk }));
  });
};

