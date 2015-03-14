if (process.env.NODE_ENV === 'development') {
  var stats = require('app/core/stats');
}

function doDispatch(state, handlers, v) {
  if (handlers.length === 0) {
    return state;
  }

  var handler = handlers[0][0];
  var name = handlers[0][1];

  if (process.env.NODE_ENV === 'development') {
    stats.time(name);
  }

  var nextState = handler(state, v);

  if (process.env.NODE_ENV === 'development') {
    stats.timeEnd(name);
  }

  return doDispatch(nextState, handlers.slice(1), v);
}

module.exports = function dispatch(state, handlers, v) {
  return doDispatch(state, handlers, v);
};
