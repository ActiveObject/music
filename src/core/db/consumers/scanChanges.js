module.exports = function scanChanges(initValue, combine) {
  return function (history, changes) {
    return changes.scan(function (acc, transform) {
      return transform(acc, (acc, v) => combine(acc, v.value), initValue);
    }, initValue);
  };
};
