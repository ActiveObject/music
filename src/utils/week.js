var startOfYear = require('app/utils/startOfYear');
var weekms = 7 * 24 * 60 * 60 * 1000;

module.exports = function week(date) {
  return ((date.valueOf() - startOfYear(date.getFullYear())) / weekms) | 0;
};
