var EventEmitter = require('events').EventEmitter;
var React = require('react');
var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var TracklistCard = require('app/components/tracklist-card');
var AuthView = require('app/components/auth');
var GroupProfile = require('app/components/group-profile');
var ArtistProfile = require('app/components/artist-profile');
var Newsfeed = require('app/components/newsfeed');
var Player = require('app/components/player');

function EmptyLayout() {

}

EmptyLayout.prototype.render = function(appstate) {
  return React.DOM.div({ className: 'empty-view' });
};

EmptyLayout.prototype.main = function () {
  return new MainLayout();
};

EmptyLayout.prototype.auth = function (attrs) {
  return new AuthLayout(attrs);
};



function MainLayout() {

}

MainLayout.prototype.render = function(appstate, send) {
  var tracklistCard = new TracklistCard({
    player: appstate.get('player')
  });

  var main = new Main({
    key: 'main',
    activity: appstate.get('activity'),
    groups: appstate.get('groups')
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

  return new App(null, [main, sidebar]);
};

MainLayout.prototype.group = function (attrs) {
  return new GroupLayout(attrs);
};

MainLayout.prototype.artist = function (attrs) {
  return new ArtistLayout(attrs);
};

MainLayout.prototype.auth = function (attrs) {
  return new AuthLayout(attrs);
};



function ArtistLayout(attrs) {
  this.name = attrs.name;
}

ArtistLayout.prototype.render = function (appstate) {
  var tracklistCard = new TracklistCard({
    player: appstate.get('player')
  });

  var profile = new ArtistProfile({
    key: 'profile',
    artist: this.name,
    player: appstate.get('player'),
    library: appstate.get('tracks')
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

  return new App(null, [profile, sidebar]);
};

ArtistLayout.prototype.main = function () {
  return new MainLayout();
};

ArtistLayout.prototype.group = function (attrs) {
  return new GroupLayout(attrs);
};

ArtistLayout.prototype.artist = function (attrs) {
  return new ArtistLayout(attrs);
};

ArtistLayout.prototype.auth = function (attrs) {
  return new AuthLayout(attrs);
};

function AuthLayout(attrs) {
  this.vkAccount = attrs.vkAccount;
  this.url = this.vkAccount.url;
}

AuthLayout.prototype.render = function(appstate) {
  return new AuthView({ url: this.url });
};

AuthLayout.prototype.main = function () {
  return this;
};

AuthLayout.prototype.group = function () {
  return this;
};

AuthLayout.prototype.artist = function () {
  return this;
};

AuthLayout.prototype.auth = function (attrs) {
  return new AuthLayout(attrs);
};



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
    newsfeed: group.wall
  });

  var profile = new GroupProfile({
    key: 'profile',
    group: group
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, [player, newsfeed]);

  return new App(null, [profile, sidebar]);
};

GroupLayout.prototype.main = function () {
  return new MainLayout();
};

GroupLayout.prototype.group = function (attrs) {
  return new GroupLayout(attrs);
};

GroupLayout.prototype.artist = function (attrs) {
  return new ArtistLayout(attrs);
};

GroupLayout.prototype.auth = function (attrs) {
  return new AuthLayout(attrs);
};



function LayoutManager(state) {
  this.state = state;
}

LayoutManager.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: LayoutManager, enumerable: false }
});

LayoutManager.prototype.changeState = function (newState) {
  if (this.state !== newState) {
    this.state = newState;
    this.emit('change', newState);
  }

  return this;
};

LayoutManager.prototype.auth = function (vkAccount) {
  return this.changeState(this.state.auth({ vkAccount: vkAccount }));
};

LayoutManager.prototype.group = function (id) {
  return this.changeState(this.state.group({ id: id }));
};

LayoutManager.prototype.artist = function (name) {
  return this.changeState(this.state.artist({ name: name }));
};

LayoutManager.prototype.main = function () {
  return this.changeState(this.state.main());
};

module.exports = new LayoutManager(new EmptyLayout());
