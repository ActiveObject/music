var _ = require('underscore');

module.exports = function isValue(x) {
  if (_.isUndefined(x)) {
    return false;
  }

  if (_.isNull(x)) {
    return false;
  }

  return true;
};