var _ = require('underscore');

var startOfYear = _.memoize(function(year) {
  return new Date(String(year)).valueOf();
});

var dayms = 24 * 60 * 60 * 1000;

module.exports = function dayOfYear(d) {
  return ((d.valueOf() - startOfYear(d.getFullYear())) / dayms) | 0;
};
