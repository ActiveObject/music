module.exports = function scan(seed, combine) {
  return function (history, state, produce) {
    if (arguments.length === 1) {
      return history.reduce(scan, seed);
    }

    return produce(state, seed, (acc, v) => combine(acc, v.value));
  };
};
