var _ = require('underscore');

module.exports = function isEmpty(x) {
  if (!_.isFunction(x.isEmpty)) {
    throw new TypeError('isEmpty: argument should be an object with .isEmpty method');
  }

  return x.isEmpty();
};
