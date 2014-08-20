var curry = require('curry');
var Route = require('page').Route;

var proto = module.exports = function (cursor) {
  function router(appstate, next) {
    return handle(cursor, router.stack, appstate);
  }

  router.__proto__ = proto;
  router.stack = [];

  return router;
};

function handle(cursor, stack, state) {
  if (stack.length === 0) {
    console.warn('route chain does not make an app view');
    return state;
  }

  var ctx = state.get('location');
  var item = stack[0];

  if (item.route.match(ctx.path, ctx.params)) {
    if (item.arity === 1) {
      return item.fn.call({ cursor: cursor }, state);
    }

    if (item.arity === 2) {
      return item.fn.call({ cursor: cursor }, state, ctx);
    }

    if (item.arity === 3) {
      return item.fn.call({ cursor: cursor }, state, ctx, handle.bind(null, cursor, stack.slice(1)));
    }
  }

  return handle(cursor, stack.slice(1), state);
}

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