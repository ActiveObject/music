var key = require('keymaster');
var record = require('./time-machine');

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

  return function() {
    console.log('Start recording...');
    window.stopRecording = record(vbus);
  };
};
