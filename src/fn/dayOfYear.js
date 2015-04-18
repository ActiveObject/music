var startOfYear = require('app/fn/startOfYear');
var dayms = 24 * 60 * 60 * 1000;

module.exports = function dayOfYear(d) {
  return ((d.valueOf() - startOfYear(d.getFullYear())) / dayms) | 0;
};
