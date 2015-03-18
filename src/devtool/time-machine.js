var Atom = require('app/core/atom');
var TimeRecord = require('./time-record');

module.exports = function(vbus) {
  var history = [];
  var unsubscribe = vbus.onValue(v => history.push({ time: Date.now(), value: v }));

  return () => {
    var record = new TimeRecord(history);

    unsubscribe();

    return record;
  };
};
