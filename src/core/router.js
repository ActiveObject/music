var Route = require('page').Route;

var proto = module.exports = function () {
  function router(appstate, ctx, next) {
    router.handle(appstate, ctx, next);
  }

  router.__proto__ = proto;
  router.stack = [];

  return router;
};

proto.handle = function (appstate, ctx, done) {
  var stack = this.stack;
  var i = 0;

  next(appstate);

  function next(state) {
    if (i >= stack.length) {
      return done(state, ctx);
    }

    var item = stack[i++];

    if (item.route.match(ctx.path, ctx.params)) {
      if (item.arity === 1) {
        return next(item.fn(state));
      }

      if (item.arity === 2) {
        return item.fn(state, next);
      }

      if (item.arity === 3) {
        return item.fn(state, ctx, next);
      }
    }

    return next(state);
  }
};

proto.use = function (path, fn) {
  if (arguments.length === 1) {
    fn = path;
    path = '*';
  }

  var route = new Route(path);

  this.stack.push({
    arity: fn.length,
    route: route,
    fn: fn
  });

  return this;
};

proto.on = function (path, fn) {
  var route = new Route(path);

  this.stack.push({
    arity: fn.length,
    route: route,
    fn: fn
  });

  return this;
};