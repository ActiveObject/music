module.exports = function scanChanges(seed, combine) {
  return function (history, changes) {
    return changes.scan(function (acc, transform) {
      return transform(acc, (acc, v) => combine(acc, v.value), seed);
    }, seed);
  };
};
