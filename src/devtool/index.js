var key = require('keymaster');
var record = require('./time-machine');
var db = require('app/core/db3');
var changelog = require('app/core/db/producers/changelog');
var seq = require('app/core/db/producers/seq');

module.exports = function (vbus) {
  key('command+shift+x', function() {
    if (!window.stopRecording) {
      console.log('Start recording...');
      window.stopRecording = record(vbus);
    } else {
      console.log('Stop recording. Time record saved to window.timeRecord');
      window.timeRecord = window.stopRecording();
      window.stopRecording = null;
    }
  });

  window.values = [];

  vbus.onValue(v => values.push(v));

  window.replay = function(vs) {
    db.modify(changelog(vs));
  };

  window.play = function () {
    var event = seq(0);
    db.modify(changelog([]));

    function next(vs) {
      if (vs.length === 0) {
        return console.log('STOP');
      }

      db.modify(event(vs[0]));
      setTimeout(() => next(vs.slice(1)), 100);
    }

    next(values);
  };


  return function() {
    console.log('Start recording...');
    window.stopRecording = record(vbus);
  };
};
