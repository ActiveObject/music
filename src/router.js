var page = require('page');
var layouts = require('app/layouts');

module.exports = function (receive, send) {
  page('/', function () {
    send('layout:change', layouts.main);
  });

  page('/groups/:id', function (ctx) {
    send('layout:change', layouts.group(parseInt(ctx.params.id, 10)));
  });

  receive('app:start', page);
};