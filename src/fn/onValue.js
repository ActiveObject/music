module.exports = function onValue(stream, fn) {
  stream.onValue(fn);

  return function() {
    stream.offValue(fn);
  };
};
