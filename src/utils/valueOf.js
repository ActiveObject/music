var isDatom = require('app/utils/isDatom');

module.exports = function valueOf(v) {
  if (typeof v === 'string') {
    return v;
  }

  if (Array.isArray(v)) {
    return v[1];
  }

  if (typeof v.tag === 'function') {
    return v;
  }

  if (isDatom(v)) {
    return v.v;
  }

  throw new TypeError('Unknown vbus value', v);
};
