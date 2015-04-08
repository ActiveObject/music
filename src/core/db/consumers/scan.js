module.exports = function scan(initValue, combine) {
  return function (history, state, produce) {
    if (arguments.length === 1) {
      return history.reduce(scan, initValue);
    }

    return produce(state, initValue, (acc, v) => combine(acc, v.value));
  };
};