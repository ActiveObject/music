var _ = require('underscore');
var curry = require('curry');

/**
 * Calculate hash code for arbitrary string or number.
 * @param {Number|String} value
 * @return {Number} hash code
 */
function hashCode(value) {
  var hash = 0, character;

  if (typeof value === 'number') {
    return value;
  }

  if (value.length === 0) { return hash; }

  for (var i = 0, l = value.length; i < l; ++i) {
    character = value.charCodeAt(i);
    hash = (((hash << 5) - hash) + character) | 0; // Convert to 32bit integer
  }

  return hash;
}

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

exports.print = function print(v) {
  console.log(v);
  return v;
};

exports.hashCode = hashCode;

exports.combineHash = function (hashCode, member) {
  return 31 * hashCode + member.hashCode();
};
