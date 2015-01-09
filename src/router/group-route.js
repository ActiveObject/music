var React = require('react');
var GroupRouteCmp = React.createFactory(require('app/components/group-layout.jsx'));

var MainRoute = require('app/router/main-route');
var ArtistRoute = require('app/router/artist-route');
var AuthRoute = require('app/router/auth-route');

var LastNWeeksDRange = require('app/values/last-nweeks-drange');

function GroupRoute(attrs) {
  this.id = parseInt(attrs.id);
  this.period = new LastNWeeksDRange(32, new Date());
}

GroupRoute.prototype.render = function (appstate) {
  return new GroupRouteCmp({
    id: this.id,
    period: this.period,
    player: appstate.get('player'),
    groups: appstate.get('groups'),
    activities: appstate.get('activities')
  });
};

GroupRoute.prototype.main = function () {
  return MainRoute.create();
};

GroupRoute.prototype.group = function (attrs) {
  return new GroupRoute(attrs);
};

GroupRoute.prototype.artist = function (attrs) {
  return ArtistRoute.create(attrs);
};

GroupRoute.prototype.auth = function (attrs) {
  return AuthRoute.create(attrs);
};

exports.create = function(attrs) {
  return new GroupRoute(attrs);
};
