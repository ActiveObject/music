module.exports = function seq(initValue) {
  var i = initValue;

  return function event(v) {
    var item = { id: i++, value: v };

    return function (state, initState, consume) {
      return consume(state, item);
    };
  };
};
