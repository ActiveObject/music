var key = require('keymaster');
var TimeMachine = require('./time-machine');

module.exports = function (app) {
  var tm = new TimeMachine(app);

  key('command+shift+x', function() {
    if (!window.stopRecording) {
      console.log('Start recording...');
      window.stopRecording = tm.record();
    } else {
      console.log('Stop recording. Time record saved to window.timeRecord');
      window.timeRecord = window.stopRecording();
      window.stopRecording = null;
    }
  });

  return tm;
};
