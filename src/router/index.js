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
var EmptyRoute = require('app/router/empty-route');
var Atom = require('app/core/atom');

/**
 * Router implements atom protocol.
 */
function Router(mountPoint) {
  this.mountPoint = mountPoint;
  this.atom = new Atom(EmptyRoute.create());

  page('/', () => this.main());
  page('/groups/:id', (ctx) => this.group(ctx.params.id));
  page('/artist/:name', (ctx) => this.artist(ctx.params.name));
}

Router.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Router, enumerable: false }
});

Router.prototype.auth = function (vkAccount) {
  Atom.update(this, state => state.auth({ vkAccount: vkAccount }));
};

Router.prototype.group = function (id) {
  Atom.update(this, state => state.group({ id: id }));
};

Router.prototype.artist = function (name) {
  Atom.update(this, state => state.artist({ name: name }));
};

Router.prototype.main = function () {
  Atom.update(this, state => state.main());
};

Router.prototype.start = function() {
  page();
};

module.exports = new Router('activeRoute');
