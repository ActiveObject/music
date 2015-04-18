module.exports = function changelog(vs) {
  var vals = vs.map((v, i) => ({ id: i, value: v }));

  return function(state, seed, consume) {
    return vals.reduce(consume, seed);
  };
};
