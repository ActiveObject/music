var App = require('app/components/app');
var Sidebar = require('app/components/sidebar');
var GroupProfile = require('app/components/group-profile');
var Newsfeed = require('app/components/newsfeed');
var Player = require('app/components/player');
var IScrollLayer = require('app/components/iscroll-layer');
var Layer = require('app/components/layer');
var MainLayout = require('app/layout/main-layout');
var ArtistLayout = require('app/layout/artist-layout');
var AuthLayout = require('app/layout/auth-layout');


function GroupLayout(attrs) {
  this.id = parseInt(attrs.id);
}

GroupLayout.prototype.render = function (appstate) {
  var group = appstate.get('groups').findById(this.id);

  var player = new Player({
    key: 'player',
    player: appstate.get('player')
  });

  var newsfeed = new Newsfeed({
    key: 'newsfeed',
    newsfeed: group.wall,
    player: appstate.get('player')
  });

  var container = new IScrollLayer({}, newsfeed);

  var layer1 = new Layer({ className: 'pane-body group-sidebar', key: 'layer1' }, container);
  var layer2 = new Layer({ className: 'pane-body', key: 'layer2' }, player);

  var profile = new GroupProfile({
    key: 'profile',
    group: group
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, [layer1, layer2]);

  return new App(null, [profile, sidebar]);
};

GroupLayout.prototype.main = function () {
  return MainLayout.create();
};

GroupLayout.prototype.group = function (attrs) {
  return GroupLayout.create(attrs);
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
