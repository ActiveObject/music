module.exports = function plug(bus, stream) {
  bus.plug(stream);

  return function() {
    bus.unplug(stream);
  };
};
