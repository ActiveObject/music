var EmptyLayout = require('./empty');
var AuthLayout = require('./auth');
var MainLayout = require('./main');
var GroupLayout = require('./group');
var ArtistLayout = require('./artist');

exports.empty = new EmptyLayout();
exports.main = new MainLayout();

exports.auth = function (vkAccount) {
  return new AuthLayout(vkAccount);
};

exports.group = function(id) {
  return new GroupLayout({ id: id });
};

exports.artist = function (name) {
  return new ArtistLayout({ name: name });
};
