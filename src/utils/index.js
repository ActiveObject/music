var _ = require('underscore');
var curry = require('curry');

exports.not = function (predicate, ctx) {
  return function not() {
    return !predicate.apply(ctx, arguments);
  };
};

exports.where = curry(function where(condition, value) {
  return _.pairs(condition).every(function (pair) {
    return value[pair[0]] === pair[1];
  });
});


exports.isValue = function isValue(x) {
  if (_.isUndefined(x)) {
    return false;
  }

  if (_.isNull(x)) {
    return false;
  }

  return true;
};