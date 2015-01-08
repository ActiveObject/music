/**
 * Layout is a module the main purpose of is to make
 * a main app component from given application state.
 * Each concrete layout should have all possible transitions to other layouts by
 * implementing transition methods.
 * Layout is a sum type of all possible app layout.
 *
 * type Layout =
 *   | EmptyLayout
 *   | MainLayout
 *   | ArtistLayout of name
 *   | GroupLayout of id
 *   | AuthLayout of vkAccount
 *
 * interface Layout =
 *   render: (appstate, send) -> ReactElement
 */

var EventEmitter = require('events').EventEmitter;
var page = require('page');
var EmptyLayout = require('app/layout/empty-layout');
var Atom = require('app/core/atom');

/**
 * LayoutManager implements atom protocol.
 */
function LayoutManager(mountPoint) {
  this.mountPoint = mountPoint;
  this.atom = new Atom(EmptyLayout.create());

  page('/', () => this.main());
  page('/groups/:id', (ctx) => this.group(ctx.params.id));
  page('/artist/:name', (ctx) => this.artist(ctx.params.name));
}

LayoutManager.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: LayoutManager, enumerable: false }
});

LayoutManager.prototype.auth = function (vkAccount) {
  Atom.update(this, state => state.auth({ vkAccount: vkAccount }));
};

LayoutManager.prototype.group = function (id) {
  Atom.update(this, state => state.group({ id: id }));
};

LayoutManager.prototype.artist = function (name) {
  Atom.update(this, state => state.artist({ name: name }));
};

LayoutManager.prototype.main = function () {
  Atom.update(this, state => state.main());
};

LayoutManager.prototype.start = function() {
  page();
};

module.exports = new LayoutManager('layout');
