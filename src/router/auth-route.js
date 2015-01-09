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
  transition: (prevRoute, nextRoute) => prevRoute
};

exports.create = function(attrs) {
  return new AuthRoute(attrs);
};
