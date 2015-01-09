var React = require('react');
var MainRouteCmp = React.createFactory(require('app/components/main-layout.jsx'));

var GroupRoute = require('app/router/group-route');
var ArtistRoute = require('app/router/artist-route');
var AuthRoute = require('app/router/auth-route');

var LastNWeeksDRange = require('app/values/last-nweeks-drange');

function MainRoute() {
  this.groups = [41293763, 32211876, 34110702, 28152291];
  this.period = new LastNWeeksDRange(32, new Date());
}

MainRoute.prototype.render = function(appstate) {
  return MainRouteCmp({
    key: 'main',
    player: appstate.get('player'),
    groups: appstate.get('groups'),
    activities: appstate.get('activities'),
    visibleGroups: this.groups,
    period: this.period
  });
};

MainRoute.prototype.group = function (attrs) {
  return GroupRoute.create(attrs);
};

MainRoute.prototype.artist = function (attrs) {
  return ArtistRoute.create(attrs);
};

MainRoute.prototype.auth = function (attrs) {
  return AuthRoute.create(attrs);
};

MainRoute.prototype.main = function() {
  return this;
};

exports.create = function() {
  return new MainRoute();
};
