var tagOf = require('app/utils/tagOf');

module.exports = function addToSet(valueTag) {
  return function union(acc, v) {
    if (tagOf(v) === valueTag) {
      return acc.union(v[1]);
    }

    return acc;
  };
};