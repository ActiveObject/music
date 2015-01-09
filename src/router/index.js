/**
 * type Route =
 *   | EmptyRoute
 *   | MainRoute
 *   | ArtistRoute of name
 *   | GroupRoute of id
 *   | AuthRoute of vkAccount
 *
 * interface Route =
 *   render: (appstate, send) -> ReactElement
 */

var EventEmitter = require('events').EventEmitter;
var page = require('page');
var Atom = require('app/core/atom');

var AuthRoute = require('app/router/auth-route');
var GroupRoute = require('app/router/group-route');
var ArtistRoute = require('app/router/artist-route');
var MainRoute = require('app/router/main-route');
var emptyRoute = require('app/router/empty-route');

/**
 * Router implements atom protocol.
 */
function Router(mountPoint) {
  this.mountPoint = mountPoint;
  this.atom = new Atom(emptyRoute);

  page('/', () => this.main());
  page('/groups/:id', (ctx) => this.group(ctx.params.id));
  page('/artist/:name', (ctx) => this.artist(ctx.params.name));
}

Router.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Router, enumerable: false }
});

Router.prototype.auth = function (vkAccount) {
  this.transitionTo(new AuthRoute({ vkAccount: vkAccount }));
};

Router.prototype.group = function (id) {
  this.transitionTo(new GroupRoute({ id: id }));
};

Router.prototype.artist = function (name) {
  this.transitionTo(new ArtistRoute({ name: name }));
};

Router.prototype.main = function () {
  this.transitionTo(new MainRoute());
};

Router.prototype.transitionTo = function (nextRoute) {
  Atom.update(this, function (currRoute) {
    return nextRoute.lifecycle.transition(currRoute, nextRoute);
  });
};

Router.prototype.start = function() {
  page();
};

module.exports = new Router('activeRoute');
