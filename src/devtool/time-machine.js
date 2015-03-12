var Atom = require('app/core/atom');

function TimeRecord(history) {
  this.history = history;
}

TimeRecord.prototype.play = function(app, render) {
  app.pause();

  var next = (i) => {
    if (i >= this.history.length) {
      return app.resume();
    }

    render(this.history[i].value);

    if (i - 2 === this.history.length) {
      setTimeout(next.bind(null, i + 1), this.history[i].time - this.history[i - 1].time);
    } else {
      setTimeout(next.bind(null, i + 1), this.history[i + 1].time - this.history[i].time);
    }
  };

  next(0);
};

function TimeMachine(app) {
  this.app = app;
  this.history = [];
}

TimeMachine.prototype.record = function() {
  var unsubscribe = Atom.listen(app, (v) => this.history.push({
    time: Date.now(),
    value: v
  }));

  return () => {
    var record = new TimeRecord(this.history);

    this.history = [];
    unsubscribe();

    return record;
  };
};

module.exports = TimeMachine;
