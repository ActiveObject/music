var React = require('react');
var App = React.createFactory(require('app/components/app'));
var Sidebar = React.createFactory(require('app/components/sidebar'));
var ArtistProfile = React.createFactory(require('app/components/artist-profile'));
var LazyTracklist = React.createFactory(require('app/components/lazy-tracklist'));

var MainLayout = require('app/layout/main-layout');
var AuthLayout = require('app/layout/auth-layout');
var GroupLayout = require('app/layout/group-layout');

function ArtistLayout(attrs) {
  this.name = attrs.name;
}

ArtistLayout.prototype.render = function (appstate) {
  var tracklist = new LazyTracklist({
    player: appstate.get('player'),
    playlist: appstate.get('player').playlist
  });

  var profile = new ArtistProfile({
    key: 'profile',
    artist: this.name,
    player: appstate.get('player'),
    library: appstate.get('tracks')
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklist);

  return new App(null, [profile, sidebar]);
};

ArtistLayout.prototype.main = function () {
  return MainLayout.create();
};

ArtistLayout.prototype.group = function (attrs) {
  return GroupLayout.create(attrs);
};

ArtistLayout.prototype.artist = function (attrs) {
  return ArtistLayout.create(attrs);
};

ArtistLayout.prototype.auth = function (attrs) {
  return AuthLayout.create(attrs);
};

exports.create = function(attrs) {
  return new ArtistLayout(attrs);
};
