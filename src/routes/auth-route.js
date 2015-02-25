var React = require('react');
var AuthView = React.createFactory(require('app/components/auth'));

function AuthRoute(attrs) {
  this.vkAccount = attrs.vkAccount;
  this.url = this.vkAccount.url;
}

AuthRoute.prototype.render = function(appstate) {
  return new AuthView({ url: this.url });
};

AuthRoute.prototype.lifecycle = {
  transition: function (prevRoute, nextRoute) {
    if (nextRoute instanceof AuthRoute) {
      return nextRoute;
    }

    return prevRoute;
  }
};

module.exports = AuthRoute;
