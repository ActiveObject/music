/**
 * Calculate hash code for arbitrary string or number.
 * @param {Number|String} value
 * @return {Number} hash code
 */
module.exports = function hashCode(value) {
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
};
