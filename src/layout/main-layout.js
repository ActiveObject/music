var React = require('react');
var MainLayoutCmp = React.createFactory(require('app/components/main-layout.jsx'));

var GroupLayout = require('app/layout/group-layout');
var ArtistLayout = require('app/layout/artist-layout');
var AuthLayout = require('app/layout/auth-layout');

function MainLayout() {
  this.groups = [41293763, 32211876, 34110702, 28152291];
}

MainLayout.prototype.render = function(appstate) {
  return MainLayoutCmp({
    key: 'main',
    player: appstate.get('player'),
    visibleGroups: this.groups
  });
};

MainLayout.prototype.group = function (attrs) {
  return GroupLayout.create(attrs);
};

MainLayout.prototype.artist = function (attrs) {
  return ArtistLayout.create(attrs);
};

MainLayout.prototype.auth = function (attrs) {
  return AuthLayout.create(attrs);
};

MainLayout.prototype.main = function() {
  return this;
};

exports.create = function() {
  return new MainLayout();
};
