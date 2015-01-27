module.exports = function dispatch(state, handlers, datom) {
  if (handlers.length === 0) {
    return state;
  }

  var handler = handlers[0];

  if (handler.length === 3) {
    return handler(state, datom, function (appstate) {
      return dispatch(appstate, handlers.slice(1));
    });
  }

  return dispatch(handler(state, datom), handlers.slice(1), datom);
};
