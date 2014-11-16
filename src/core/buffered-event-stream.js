var EventEmitter = require('events').EventEmitter;

function BufferedEventStream(source, onEvent) {
  this._events = [];
  this._paused = true;
  this._onEvent = onEvent;

  source.onValue(function (event) {
    this._events.push(event);

    if (!this._paused) {
      this.emit('event');
    }
  }.bind(this));

  this.on('event', this._process.bind(this));
}

BufferedEventStream.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: BufferedEventStream, enumerable: false }
});

BufferedEventStream.prototype.pause = function () {
  this._paused = true;
};

BufferedEventStream.prototype.resume = function () {
  this._paused = false;

  if (this._events.length > 0) {
    this.emit('event');
  }
};

BufferedEventStream.prototype._process = function () {
  var event = this._events.shift();
  this._onEvent.call(null, event);

  if (this._events.length > 0) {
    this._process();
  }
};

module.exports = BufferedEventStream;