var _ = require('underscore');

module.exports = _.memoize(function(year) {
  return new Date(String(year)).valueOf();
});
