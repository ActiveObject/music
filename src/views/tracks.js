var Tracklist = require('app/components/Tracklist');

exports.all = function() {
  return function(appstate) {
    return new Tracklist({
      filter: null,
      items: []
    });
  };
};