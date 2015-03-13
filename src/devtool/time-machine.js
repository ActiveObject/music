var Atom = require('app/core/atom');
var TimeRecord = require('./time-record');

function TimeMachine(app) {
  this.app = app;
  this.history = [];
}

TimeMachine.prototype.record = function() {
  var unsubscribe = Atom.listen(this.app, (v) => this.history.push({
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
