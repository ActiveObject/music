var accounts = require('app/accounts');
var Layout = require('app/layouts');

module.exports = function (receive, send) {
  return function authService(appstate, datom, next) {
    if (!appstate.get('user').isAuthenticated() && !appstate.get('userLoading')) {
      send({ e: 'app', a: ':app/layout', v: Layout.auth(accounts.vk) });
      return appstate.set('userLoading', true);
    }

    if (appstate.get('user').isAuthenticated() && appstate.get('userLoading')) {
      return next(appstate.set('userLoading', false));
    }

    return next(appstate);
  };
};
