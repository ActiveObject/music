var page = require('page');
var Layout = require('app/layouts');

module.exports = function (receive, send) {
  page('/', function () {
    send('layout:change', Layout.main);
  });

  page('/groups/:id', function (ctx) {
    send('layout:change', Layout.group(ctx.params.id));
  });

  page('/artist/:name', function (ctx) {
    send('layout:change', Layout.artist(ctx.params.name));
  });

  receive('app:start', page);
};
