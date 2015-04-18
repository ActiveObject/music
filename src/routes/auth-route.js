var React = require('react');
var AuthView = React.createFactory(require('app/components/auth'));

function AuthRoute(attrs) {
  this.vkAccount = attrs.vkAccount;
}

AuthRoute.prototype.render = function(appstate) {
  return new AuthView({ url: this.vkAccount.url });
};

AuthRoute.prototype.lifecycle = {
  transition: function (prevRoute, nextRoute) {
    if (nextRoute instanceof AuthRoute) {
      return nextRoute;
    }

    return prevRoute;
  }
};

AuthRoute.prototype.tag = function () {
  return 'auth-route';
};

AuthRoute.prototype.toJSON = function () {
  return {
    'router:auth-route': {
      vkAccount: this.vkAccount
    }
  };
};

module.exports = AuthRoute;
