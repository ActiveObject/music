var React = require('react');
var App = React.createFactory(require('app/components/app.jsx'));
var GroupProfile = React.createFactory(require('app/components/group-profile.jsx'));
var Newsfeed = React.createFactory(require('app/components/newsfeed'));
var Player = React.createFactory(require('app/components/player'));
var IScrollLayer = React.createFactory(require('app/components/iscroll-layer.jsx'));
var Box = React.createFactory(require('app/components/box.jsx'));

var MainLayout = require('app/layout/main-layout');
var ArtistLayout = require('app/layout/artist-layout');
var AuthLayout = require('app/layout/auth-layout');

var appstate = require('app/core/appstate');


function GroupLayout(attrs) {
  this.id = parseInt(attrs.id);
  this.group = appstate.groupById(this.id);
  this.newsfeed = appstate.newsfeedForGroup(this.id);
  this.activity = appstate.activityForGroup(this.id);
}

GroupLayout.prototype.render = function (appstate) {
  var profile = new GroupProfile({
    group: this.group.atom.value,
    activity: this.activity.atom.value
  });

  var newsfeed = new Newsfeed({
    newsfeed: this.newsfeed.atom.value,
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
