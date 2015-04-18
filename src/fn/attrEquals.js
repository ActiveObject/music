module.exports = function attrEquals (x, y) {
  return function(attr) {
    return x[attr] === y[attr];
  };
};
