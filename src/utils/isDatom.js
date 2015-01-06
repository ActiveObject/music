var _ = require('underscore');

module.exports = function isDatom(v) {
  return _.isObject(v) && _.every(['e', 'a', 'v'], function (key) {
    return _.has(v, key);
  });
};