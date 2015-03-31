var Atom = require('app/core/atom');
var TimeRecord = require('./time-record');

module.exports = function(vbus) {
  var history = [];
  var addToHistory = v => history.push({ time: Date.now(), value: v });
  vbus.onValue(addToHistory);

  return () => {
    var record = new TimeRecord(history);
    vbus.offValue(addToHistory);
    return record;
  };
};
