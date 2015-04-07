module.exports = function scanSince(n, initValue, combine) {
  return function (history, changes) {
    var state = history.reduce(function (acc, v) {
      return v.id >= n ? combine(acc, v.value) : acc;
    }, initValue);

    return changes.scan(function (acc, transform) {
      return transform(acc, function (acc, v) {
        return v.id >= n ? combine(acc, v.value) : acc;
      }, initValue);
    }, state);
  };
};