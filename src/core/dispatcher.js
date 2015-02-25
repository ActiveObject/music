var stats = require('app/core/stats');

function doDispatch(state, handlers, datom) {
  if (handlers.length === 0) {
    return state;
  }

  var handler = handlers[0][0];
  var name = handlers[0][1];
  var startTime = Date.now();

  var nextState = handler(state, datom);

  stats.push({
    name: name,
    startTime: startTime,
    endTime: Date.now()
  });

  return doDispatch(nextState, handlers.slice(1), datom);
}

module.exports = function dispatch(state, handlers, datom) {
  var startTime = Date.now();
  var result = doDispatch(state, handlers, datom);

  stats.push({
    name: 'dispatch[' + datom.a + ']',
    startTime: startTime,
    endTime: Date.now()
  });

  return result;
};
