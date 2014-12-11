var React = require('react');
var AuthView = React.createFactory(require('app/components/auth'));

function AuthLayout(attrs) {
  this.vkAccount = attrs.vkAccount;
  this.url = this.vkAccount.url;
}

AuthLayout.prototype.render = function(appstate) {
  return new AuthView({ url: this.url });
};

AuthLayout.prototype.main = function () {
  return this;
};

AuthLayout.prototype.group = function () {
  return this;
};

AuthLayout.prototype.artist = function () {
  return this;
};

AuthLayout.prototype.auth = function (attrs) {
  return new AuthLayout(attrs);
};

exports.create = function(attrs) {
  return new AuthLayout(attrs);
};
