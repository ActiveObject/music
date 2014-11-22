var page = require('page');
var layouts = require('app/layouts');

module.exports = function (receive, send) {
  page('/', function () {
    send('layout:change', layouts.main);
  });

  page('/groups/:id', function (ctx) {
    send('layout:change', layouts.group(parseInt(ctx.params.id, 10)));
  });

  page('/artist/:name', function (ctx) {
    send('layout:change', layouts.artist(ctx.params.name));
  });

  receive('app:start', page);
};