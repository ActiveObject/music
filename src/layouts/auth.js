var AuthView = require('app/components/auth');

function AuthLayout(attrs) {
  this.vkAccount = attrs.vkAccount;
  this.url = this.vkAccount.url;
}

AuthLayout.prototype.render = function(appstate) {
  return new AuthView({ url: this.url });
};

module.exports = AuthLayout;
