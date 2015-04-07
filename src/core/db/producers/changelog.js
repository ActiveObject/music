module.exports = function changelog(vs) {
  return function (history, combine, initValue) {
    return vs.map((v, i) => ({ id: i, value: v })).reduce(combine, initValue);
  };
};