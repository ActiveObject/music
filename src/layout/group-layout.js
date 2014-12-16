var React = require('react');
var App = React.createFactory(require('app/components/app.jsx'));
var GroupProfile = React.createFactory(require('app/components/group-profile'));
var Newsfeed = React.createFactory(require('app/components/newsfeed'));
var Player = React.createFactory(require('app/components/player'));
var IScrollLayer = React.createFactory(require('app/components/iscroll-layer.jsx'));
var Box = React.createFactory(require('app/components/box.jsx'));

var MainLayout = require('app/layout/main-layout');
var ArtistLayout = require('app/layout/artist-layout');
var AuthLayout = require('app/layout/auth-layout');


function GroupLayout(attrs) {
  this.id = parseInt(attrs.id);
}

GroupLayout.prototype.render = function (appstate) {
  var group = appstate.get('groups').findById(this.id);

  var profile = new GroupProfile({ group: group });

  var newsfeed = new Newsfeed({
    newsfeed: group.wall,
    player: appstate.get('player')
  });

  var player = new Player({ player: appstate.get('player') });

  var regionA = new Box({ prefix: 'ra-', key: 'region-a' }, profile);
  var regionB = new Box({ prefix: 'rb-', key: 'region-b' }, new IScrollLayer(null, newsfeed));
  var regionC = new Box({ prefix: 'rc-', key: 'region-c' }, player);

  return new App({ layout: ['two-region', 'group-layout'] }, [regionA, regionB, regionC]);
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
