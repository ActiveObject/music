var accounts = require('app/accounts');
var Layout = require('app/layouts');

module.exports = function (receive, send) {
  return function authService(appstate, type, data, next) {
    if (!appstate.get('user').isAuthenticated() && !appstate.get('userLoading')) {
      send('layout:change', Layout.auth(accounts.vk));
      return appstate.set('userLoading', true);
    }

    if (appstate.get('user').isAuthenticated() && appstate.get('userLoading')) {
      return next(appstate.set('userLoading', false));
    }

    return next(appstate);
  };
};
