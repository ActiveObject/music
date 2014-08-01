var ActiveTrack = require('app/components/ActiveTrack');

module.exports = function(appstate) {
  return new ActiveTrack({
    key: 'active-track',
    id: 1
  });
};