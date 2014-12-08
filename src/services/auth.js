var accounts = require('app/accounts');
var layout = require('app/layout');

module.exports = function (receive, send) {
  return function authService(appstate, datom, next) {
    if (!appstate.get('user').isAuthenticated() && !appstate.get('userLoading')) {
      layout.auth(accounts.vk);
      return appstate.set('userLoading', true);
    }

    if (appstate.get('user').isAuthenticated() && appstate.get('userLoading')) {
      return next(appstate.set('userLoading', false));
    }

    return next(appstate);
  };
};
