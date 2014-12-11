var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var Player = require('app/components/player');
var LazyTracklist = require('app/components/lazy-tracklist');
var Layer = require('app/components/layer');
var GroupLayout = require('app/layout/group-layout');
var ArtistLayout = require('app/layout/artist-layout');
var AuthLayout = require('app/layout/auth-layout');

function MainLayout() {

}

MainLayout.prototype.render = function(appstate, send) {
  var tracklist = new LazyTracklist({
    player: appstate.get('player'),
    playlist: appstate.get('player').visiblePlaylist()
  });

  var player = new Player({
    player: appstate.get('player')
  });

  var layer1 = new Layer({ className: 'pane-body tracklist-card', key: 'layer1' }, tracklist);
  var layer2 = new Layer({ className: 'pane-body', key: 'layer2' }, player);
  var sidebar = new Sidebar({ key: 'sidebar' }, [layer1, layer2]);

  var main = new Main({
    key: 'main',
    activity: appstate.get('activity'),
    groups: appstate.get('groups')
  });

  return new App(null, [main, sidebar]);
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
