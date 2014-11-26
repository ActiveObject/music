var vk = require('app/vk');
var AuthView = require('app/components/auth');

function AuthLayout(attrs) {
  this.vkAccount = attrs.vkAccount;
  this.url = vk.makeAuthUrl(this.vkAccount);
}

AuthLayout.prototype.render = function(appstate) {
  return new AuthView({ url: this.url });
};

module.exports = AuthLayout;
