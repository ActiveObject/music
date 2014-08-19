var curry = require('curry');
var Vk = require('app/services/vk');
var AuthView = require('app/components/auth');
var accounts = require('app/accounts');

function authenticate(appstate, ctx, next) {
  if (!Vk.isAuthenticated(appstate.get('user'))) {
    return new AuthView({
      url: Vk.makeAuthUrl(accounts.vk)
    });
  }

  return next(appstate);
}

exports.main = require('./main');
exports.group = require('./group');
exports.auth = authenticate;