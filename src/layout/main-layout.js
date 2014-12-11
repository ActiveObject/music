var React = require('react');
var App = React.createFactory(require('app/components/app.jsx'));
var Main = React.createFactory(require('app/components/main.jsx'));
var Player = React.createFactory(require('app/components/player'));
var LazyTracklist = React.createFactory(require('app/components/lazy-tracklist'));
var Box = React.createFactory(require('app/components/box.jsx'));

var GroupLayout = require('app/layout/group-layout');
var ArtistLayout = require('app/layout/artist-layout');
var AuthLayout = require('app/layout/auth-layout');

function MainLayout() {

}

MainLayout.prototype.render = function(appstate, send) {
  var main = new Main({
    activity: appstate.get('activity'),
    groups: appstate.get('groups')
  });

  var tracklist = new LazyTracklist({
    player: appstate.get('player'),
    playlist: appstate.get('player').visiblePlaylist()
  });

  var player = new Player({ player: appstate.get('player') });

  var regionA = new Box({ prefix: 'ra-' }, main);
  var regionB = new Box({ prefix: 'rb-' }, tracklist);
  var regionC = new Box({ prefix: 'rc-' }, player);

  return new App({ layout: ['two-region', 'main-layout'] }, [regionA, regionB, regionC]);
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
