module.exports = function scanSince(n, seed, combine) {
  function combineSince(acc, v) {
    return v.id >= n ? combine(acc, v.value) : acc;
  }

  return function (history, state, produce) {
    if (arguments.length === 1) {
      return history.reduce(combineSince, seed);
    }

    return produce(state, seed, combineSince);
  };
};
