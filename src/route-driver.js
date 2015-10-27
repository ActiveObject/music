var page = require('page');
var app = require('app');

module.exports = function() {
  page('/', function () {
    app.push({
      tag: [':app/route', ':route/main']
    });
  });

  page();
};

