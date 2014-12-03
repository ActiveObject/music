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

exports.getOrDefault = function (obj, key, defaultValue) {
  return _.has(obj, key) ? obj[key] : defaultValue;
};

exports.isEmpty = function (x) {
  if (!_.isFunction(x.isEmpty)) {
    throw new TypeError('isEmpty: argument should be an object with .isEmpty method');
  }

  return x.isEmpty();
};

exports.merge = function () {
  var objs = Array.prototype.slice.call(arguments, 0);
  objs.unshift({});
  return _.extend.apply(_, objs);
};

exports.attrEquals = function attrEquals (x, y) {
  return function(attr) {
    return x[attr] === y[attr];
  };
};
