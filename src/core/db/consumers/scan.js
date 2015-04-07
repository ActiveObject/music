module.exports = function scan(initValue, combine) {
  return function (history, changes) {
    var state = history.reduce((acc, v) => combine(acc, v.value), initValue);

    return changes.scan(function (acc, transform) {
      return transform(acc, (acc, v) => combine(acc, v.value), initValue);
    }, state);
  };
};
