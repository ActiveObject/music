module.exports = function scanChanges(seed, combine) {
  return function (history, state, produce) {
    if (arguments.length === 1) {
      return seed;
    }

    return produce(state, seed, (acc, v) => combine(acc, v.value));
  };
};
