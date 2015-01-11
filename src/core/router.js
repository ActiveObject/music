var Atom = require('app/core/atom');
var emptyRoute = require('app/routes/empty-route');

/**
 * Router implements atom protocol.
 */
function Router(mountPoint) {
  this.mountPoint = mountPoint;
  this.atom = new Atom(emptyRoute);
}

Router.prototype.transitionTo = function (nextRoute) {
  Atom.update(this, function (currRoute) {
    return nextRoute.lifecycle.transition(currRoute, nextRoute);
  });
};

module.exports = new Router('activeRoute');
