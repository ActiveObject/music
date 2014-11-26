var accounts = require('app/accounts');
var Layout = require('app/layouts');
var Vk = require('app/services/vk');

module.exports = function (receive, send) {
  return function (appstate, type, data, next) {
    if (!Vk.isAuthenticated(appstate.get('user')) && !appstate.get('userLoading')) {
      send('layout:change', Layout.auth(accounts.vk));
      return appstate.set('userLoading', true);
    }

    if (Vk.isAuthenticated(appstate.get('user') && appstate.get('userLoading'))) {
      return next(appstate.set('userLoading', false));
    }

    return next(appstate);
  };
};
