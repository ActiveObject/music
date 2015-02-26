function BufferedEventStream(source, onEvent) {
  var buffer = [];

  function process() {
    if (buffer.length === 0) {
      return;
    }

    setTimeout(function() {
      process(onEvent(buffer.shift()));
    }, 0);
  }

  source.onValue(function (event) {
    if (!this._paused) {
      return onEvent(event);
    }

    buffer.push(event);
  }.bind(this));

  this._paused = true;
  this._process = process;
}

BufferedEventStream.prototype.pause = function () {
  this._paused = true;
};

BufferedEventStream.prototype.resume = function () {
  this._paused = false;
  this._process();
};

module.exports = BufferedEventStream;
