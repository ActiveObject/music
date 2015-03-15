var isDatom = require('app/utils/isDatom');

module.exports = function tagOf(v) {
  if (typeof v === 'string') {
    return v;
  }

  if (Array.isArray(v)) {
    return v[0];
  }

  if (typeof v.tag === 'function') {
    return v.tag();
  }

  if (isDatom(v)) {
    return v.a;
  }

  throw new TypeError('Unknown vbus value', v);
};
