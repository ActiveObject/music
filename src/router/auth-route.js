var React = require('react');
var AuthView = React.createFactory(require('app/components/auth'));

function AuthRoute(attrs) {
  this.vkAccount = attrs.vkAccount;
  this.url = this.vkAccount.url;
}

AuthRoute.prototype.render = function(appstate) {
  return new AuthView({ url: this.url });
};

AuthRoute.prototype.main = function () {
  return this;
};

AuthRoute.prototype.group = function () {
  return this;
};

AuthRoute.prototype.artist = function () {
  return this;
};

AuthRoute.prototype.auth = function (attrs) {
  return new AuthRoute(attrs);
};

exports.create = function(attrs) {
  return new AuthRoute(attrs);
};
