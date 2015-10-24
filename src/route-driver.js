var page = require('page');
var onValue = require('app/onValue');

module.exports = function(vbus) {
  page('/', function () {
    vbus.emit({
      tag: [':app/route', ':route/main']
    });
  });

  page();
};

