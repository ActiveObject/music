module.exports = function seq(seed) {
  var i = seed;

  return function event(v) {
    var item = { id: i++, value: v };

    return function (state, seed, consume) {
      return consume(state, item);
    };
  };
};
