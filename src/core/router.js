var Atom = require('app/core/atom');
var emptyRoute = require('app/routes/empty-route');
var router = module.exports = new Atom(emptyRoute);

router.transitionTo = function (nextRoute) {
  Atom.update(router, function (currRoute) {
    return currRoute.lifecycle.transition(currRoute, nextRoute);
  });
};
