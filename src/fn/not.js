module.exports = function not(predicate, ctx) {
  return function not() {
    return !predicate.apply(ctx, arguments);
  };
};
