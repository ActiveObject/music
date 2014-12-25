var React = require('react');
var GroupLayoutCmp = React.createFactory(require('app/components/group-layout.jsx'));

var MainLayout = require('app/layout/main-layout');
var ArtistLayout = require('app/layout/artist-layout');
var AuthLayout = require('app/layout/auth-layout');

function GroupLayout(attrs) {
  this.id = parseInt(attrs.id);
}

GroupLayout.prototype.render = function (appstate) {
  return new GroupLayoutCmp({ id: this.id, player: appstate.get('player') });
};

GroupLayout.prototype.main = function () {
  return MainLayout.create();
};

GroupLayout.prototype.group = function (attrs) {
  return new GroupLayout(attrs);
};

GroupLayout.prototype.artist = function (attrs) {
  return ArtistLayout.create(attrs);
};

GroupLayout.prototype.auth = function (attrs) {
  return AuthLayout.create(attrs);
};

exports.create = function(attrs) {
  return new GroupLayout(attrs);
};
