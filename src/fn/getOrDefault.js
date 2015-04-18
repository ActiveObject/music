var _ = require('underscore');

module.exports = function getOrDefault(obj, key, defaultValue) {
  return _.has(obj, key) ? obj[key] : defaultValue;
};