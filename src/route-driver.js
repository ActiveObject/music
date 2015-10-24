var page = require('page');
var onValue = require('app/onValue');

module.exports = function(vbus) {
  page('/', function () {
    vbus.push({
      tag: [':app/route', ':route/main']
    });
  });

  page();
};

