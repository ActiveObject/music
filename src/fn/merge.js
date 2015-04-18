var _ = require('underscore');

module.exports = function merge() {
  var objs = Array.prototype.slice.call(arguments, 0);
  objs.unshift({});
  return _.extend.apply(_, objs);
};
