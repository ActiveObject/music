var page = require('page');

module.exports = function(vbus) {
  page('/', function () {
    vbus.push({
      tag: [':app/route', ':route/main']
    });
  });

  page();
};

